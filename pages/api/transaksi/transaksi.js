// pages/api/transaksi/create.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from '../../../lib/db';
import { snap } from '../../../src/config/midtrans';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let connection;
  const lockKey = `transaction_lock`;

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // Acquire lock
    const [lockResult] = await connection.execute(
      'SELECT GET_LOCK(?, 10) as lockResult',
      [lockKey]
    );

    if (!lockResult[0].lockResult) {
      throw new Error('Another transaction is in progress');
    }

    try {
      // Check existing pending transaction
      const [existingTransactions] = await connection.execute(
        `SELECT id FROM transaksi 
         WHERE user_id = ? AND status = 'pending'
         AND id IN (
           SELECT transaksi_id FROM detail_transaksi WHERE product_id = ?
         )`,
        [session.user.id, productId]
      );

      if (existingTransactions.length > 0) {
        throw new Error('Pending transaction already exists for this product');
      }

      // Get product details
      const [products] = await connection.execute(
        'SELECT id, name, price FROM product WHERE id = ?',
        [productId]
      );

      if (products.length === 0) {
        throw new Error('Product not found');
      }

      const product = products[0];
      const totalAmount = product.price * quantity;

      // Create transaction record
      const [result] = await connection.execute(
        'INSERT INTO transaksi (user_id, total_amount, status) VALUES (?, ?, ?)',
        [session.user.id, totalAmount, 'completed']
      );

      const transactionId = result.insertId;

      // Create transaction detail
      await connection.execute(
        'INSERT INTO detail_transaksi (transaksi_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
        [transactionId, productId, quantity, product.price, totalAmount]
      );

      // Create Snap transaction
      const snapTransaction = await snap.createTransaction({
        transaction_details: {
          order_id: `TRX-${transactionId}`,
          gross_amount: totalAmount
        },
        credit_card: {
          secure: true
        },
        customer_details: {
          first_name: session.user.name,
          email: session.user.email,
          username: session.user.userName
        },
        callbacks: {
          finish: `${process.env.NEXT_PUBLIC_BASE_URL}/member/product/${productId}`,
          error: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/${productId}`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/member/transaksi`
        }
      });

      // Update transaction with snap token
      await connection.execute(
        'UPDATE transaksi SET snap_token = ? WHERE id = ?',
        [snapTransaction.token, transactionId]
      );

      await connection.commit();

      res.status(200).json({
        transactionId,
        snapToken: snapTransaction.token,
        orderId: `TRX-${transactionId}`
      });

    } finally {
      // Release lock
      await connection.execute(
        'SELECT RELEASE_LOCK(?)',
        [lockKey]
      );
    }

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Transaction error:', error);
    res.status(500).json({ error: error.message || 'Failed to create transaction' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}