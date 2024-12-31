import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from '../../../lib/db';
import { snap } from '../../../src/config/midtrans';

export default async function handler(req, res) {
 if (req.method !== 'POST') {
   return res.status(405).json({ error: 'Method not allowed' });
 }

 let connection;
 const lockKey = `transaction_lock_${req.body.productId}_${req.body.timestamp}`;

 try {
   const session = await getServerSession(req, res, authOptions);
   if (!session) {
     return res.status(401).json({ error: 'Unauthorized' });
   }

   const { productId, quantity, timestamp } = req.body;

   if (!productId || !quantity || !timestamp) {
     return res.status(400).json({ error: 'Missing required fields' });
   }

   connection = await db.getConnection();
   await connection.beginTransaction();

   const [lockResult] = await connection.execute(
     'SELECT GET_LOCK(?, 10) as lockResult',
     [lockKey]
   );

   if (!lockResult[0].lockResult) {
     throw new Error('Transaction is being processed, please try again');
   }

   try {
     const [products] = await connection.execute(
       'SELECT id, name, price FROM product WHERE id = ?',
       [productId]
     );

     if (products.length === 0) {
       throw new Error('Product not found');
     }

     const product = products[0];
     const totalAmount = product.price * quantity;
     const uniqueOrderId = `TRX-${timestamp}-${session.user.id}-${Math.random().toString(36).substring(2, 7)}`;

     // Insert dengan status completed
     const [result] = await connection.execute(
       'INSERT INTO transaksi (user_id, total_amount, status, order_id, created_at) VALUES (?, ?, ?, ?,  NOW())',
       [session.user.id, totalAmount, 'completed', uniqueOrderId]
     );

     const transactionId = result.insertId;

     await connection.execute(
       'INSERT INTO detail_transaksi (transaksi_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
       [transactionId, productId, quantity, product.price, totalAmount]
     );

     const snapTransaction = await snap.createTransaction({
       transaction_details: {
         order_id: uniqueOrderId,
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
         finish: process.env.NEXT_PUBLIC_BASE_URL + `/member/product/${productId}`,
         error: process.env.NEXT_PUBLIC_BASE_URL + `/member/product/${productId}`,
         pending: process.env.NEXT_PUBLIC_BASE_URL + '/member/transaksi'
       }
     });

     await connection.execute(
       'UPDATE transaksi SET snap_token = ? WHERE id = ?',
       [snapTransaction.token, transactionId]
     );

     await connection.commit();

     res.status(200).json({
       transactionId,
       snapToken: snapTransaction.token,
       orderId: uniqueOrderId
     });

   } finally {
     await connection.execute('SELECT RELEASE_LOCK(?)', [lockKey]);
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