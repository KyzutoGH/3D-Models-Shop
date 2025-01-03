import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from '../../../lib/db';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user.role !== 'artist') {
    return res.status(401).json({ error: 'Not authenticated or not authorized' });
  }

  let connection;
  try {
    connection = await db.getConnection();

    if (req.method === 'GET') {
      // Get total products
      const [productsCount] = await connection.execute(
        `SELECT COUNT(*) as total FROM product WHERE artist_id = ?`,
        [session.user.id]
      );

      // Get total revenue from completed transaksis
      const [revenue] = await connection.execute(
        `SELECT COALESCE(SUM(ti.price * ti.quantity), 0) as total_revenue
         FROM detail_transaksi ti
         JOIN product p ON p.id = ti.product_id
         JOIN transaksi t ON t.id = ti.transaksi_id
         WHERE p.artist_id = ? AND t.status = 'completed'`,
        [session.user.id]
      );

      // Get total products sold
      const [soldCount] = await connection.execute(
        `SELECT COALESCE(SUM(ti.quantity), 0) as total_sold
         FROM detail_transaksi ti
         JOIN product p ON p.id = ti.product_id
         JOIN transaksi t ON t.id = ti.transaksi_id
         WHERE p.artist_id = ? AND t.status = 'completed'`,
        [session.user.id]
      );

      // Get best selling product
      const [bestSeller] = await connection.execute(
        `SELECT p.name, COALESCE(SUM(ti.quantity), 0) as total_sold
         FROM detail_transaksi ti
         JOIN product p ON p.id = ti.product_id
         JOIN transaksi t ON t.id = ti.transaksi_id
         WHERE p.artist_id = ? AND t.status = 'completed'
         GROUP BY p.id, p.name
         ORDER BY total_sold DESC
         LIMIT 1`,
        [session.user.id]
      );

      return res.status(200).json({
        totalProducts: productsCount[0].total,
        totalRevenue: revenue[0].total_revenue || 0,
        productsSold: soldCount[0].total_sold || 0,
        bestSeller: bestSeller[0]?.name || '-'
      });
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  } finally {
    if (connection) await connection.release();
  }
}