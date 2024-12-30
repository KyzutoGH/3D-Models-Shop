// pages/api/products/[id].js
import db from '../../../lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      const session = await getSession({ req });
      const userId = session?.user?.id;

      // Validasi parameter ID
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid Product ID' });
      }

      // Query untuk mendapatkan detail produk dan status pembelian
      const [products] = await db.execute(
        `
        SELECT 
          p.id AS product_id, 
          p.name AS product_name, 
          p.price, 
          p.image, 
          p.model_path,
          p.preview_path,
          p.createdAt, 
          p.updatedAt, 
          p.description, 
          p.format, 
          p.polygon_count, 
          p.textures, 
          p.rigged, 
          p.specifications, 
          COUNT(r.id) AS total_reviews, 
          AVG(r.rating) AS average_rating, 
          GROUP_CONCAT(r.comment SEPARATOR " | ") AS comments, 
          GROUP_CONCAT(u.name SEPARATOR ", ") AS reviewers, 
          COALESCE(SUM(dt.quantity), 0) AS units_sold,
          EXISTS (
            SELECT 1 
            FROM transaksi t 
            JOIN detail_transaksi dt ON t.id = dt.transaksi_id 
            WHERE t.user_id = ? 
            AND dt.product_id = p.id 
            AND t.status = 'completed'
          ) as has_purchased
        FROM 
          product p 
        LEFT JOIN 
          reviews r ON p.id = r.product_id 
        LEFT JOIN 
          users u ON r.user_id = u.id 
        LEFT JOIN 
          detail_transaksi dt ON p.id = dt.product_id 
        LEFT JOIN 
          transaksi t ON dt.transaksi_id = t.id AND t.status = "completed" 
        WHERE 
          p.id = ? 
        GROUP BY 
          p.id;
        `,
        [userId || 0, id]
      );

      if (products.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const product = products[0];

      // Transform paths to full URLs
      if (product.image) {
        product.image_url = `/img/${product.image}`;
      }
      if (product.model_path) {
        product.model_url = `/models/${product.model_path}`;
      }
      if (product.preview_path) {
        product.preview_url = `/preview/${product.preview_path}`;
      }

      if (product.format && typeof product.format === 'string') {
        try {
          product.format = JSON.parse(product.format);
        } catch {
          product.format = product.format.split(',').map((f) => f.trim());
        }
      }

      res.status(200).json(product);
    } catch (error) {
      console.error('Database error:', error.message);
      res.status(500).json({ error: 'Failed to retrieve product details' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}