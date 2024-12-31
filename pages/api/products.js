// pages/api/products.js
import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [products] = await db.execute(
        `SELECT 
          p.id, 
          p.name, 
          p.price, 
          p.image,
          u.name as artist_name,
          COUNT(r.id) AS total_reviews,
          AVG(r.rating) AS average_rating,
          COUNT(dt.id) AS units_sold
        FROM product p
        LEFT JOIN users u ON p.artist_id = u.id
        LEFT JOIN reviews r ON p.id = r.product_id
        LEFT JOIN detail_transaksi dt ON p.id = dt.product_id
        GROUP BY p.id
        ORDER BY p.createdAt DESC`
      );
      
      res.status(200).json(products);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'gagal mengambil product' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}