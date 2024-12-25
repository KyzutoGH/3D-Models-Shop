// pages/api/users/[id].js
import db from '../../../lib/db';

const queryDatabase = async (query, values) => {
  try {
    const [results] = await db.execute(query, values);
    return results;
  } catch (err) {
    throw err;
  }
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Id parameter is required' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch user information and transaction statistics
      const userQuery = `
        SELECT 
          u.id AS user_id, 
          u.userName AS fullName, 
          u.email, 
          u.alamat, 
          u.nomorTelepon AS phoneNumber, 
          u.role, 
          u.tgl_register AS registrationDate,
          COUNT(t.id) AS totalTransactions, -- Total Completed Transaksi
          COALESCE(SUM(t.total_amount), 0) AS totalTransactionValue, -- Total Completed Transaction Value
          COALESCE(MAX(t.total_amount), 0) AS largestTransaction -- Largest Completed Transaction
        FROM users u
        LEFT JOIN transaksi t ON u.id = t.user_id AND t.status = "completed"
        WHERE u.id = ?
        GROUP BY u.id
      `;

      const userResults = await queryDatabase(userQuery, [id]);

      if (userResults.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userRow = userResults[0];

      // Prepare user object
      const user = {
        userId: userRow.user_id,
        fullName: userRow.fullName || 'Belum diisi',
        email: userRow.email,
        registrationDate: userRow.registrationDate
          ? new Date(userRow.registrationDate).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'N/A',
        alamat: userRow.alamat || 'Belum diisi',
        phoneNumber: userRow.phoneNumber || 'Belum diisi',
        role: userRow.role || 'N/A',
      };

      // Prepare stats object
      const stats = {
        totalTransactions: userRow.totalTransactions || 0,
        totalTransactionValue: userRow.totalTransactionValue || 0,
        largestTransaction: userRow.largestTransaction || 0,
      };

      // Fetch detailed transaction information for completed transactions
      const transactionQuery = `
        SELECT 
          t.id AS transaksi_id,
          t.total_amount,
          t.status,
          t.created_at AS transaction_created_at,
          t.updated_at AS transaction_updated_at,
          dt.product_id,
          dt.quantity,
          dt.price,
          p.name AS product_name
        FROM transaksi t
        LEFT JOIN detail_transaksi dt ON t.id = dt.transaksi_id
        LEFT JOIN product p ON dt.product_id = p.id
        WHERE t.user_id = ? AND t.status = "completed"
      `;

      const transactionDetails = await queryDatabase(transactionQuery, [id]);

      // Group transaction details by `transaksi_id`
      const transactions = transactionDetails.reduce((acc, detail) => {
        const {
          transaksi_id,
          total_amount,
          status,
          transaction_created_at,
          transaction_updated_at,
          product_id,
          product_name,
          quantity,
          price,
        } = detail;

        if (!acc[transaksi_id]) {
          acc[transaksi_id] = {
            transactionId: transaksi_id,
            totalAmount: total_amount,
            status,
            createdAt: transaction_created_at
              ? new Date(transaction_created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'N/A',
            updatedAt: transaction_updated_at
              ? new Date(transaction_updated_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'N/A',
            products: [],
          };
        }

        // Add product details to the transaction
        if (product_id) {
          acc[transaksi_id].products.push({
            productId: product_id,
            productName: product_name,
            quantity,
            price,
          });
        }

        return acc;
      }, {});

      // Convert transactions object to an array
      const transactionsArray = Object.values(transactions);

      return res.status(200).json({
        user,
        stats,
        transactions: transactionsArray,
      });
    } catch (error) {
      console.error('Database error:', error.message);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
