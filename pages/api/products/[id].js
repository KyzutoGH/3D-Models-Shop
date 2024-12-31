// pages/api/products/[id].js
import db from '../../../lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      const session = await getSession({ req });
      const userId = session?.user?.id;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid Product ID' });
      }

      const [products] = await db.execute(
        `
        SELECT 
          p.*,
          u.name as artist_name,
          u.email as artist_email,
          u.userName as artist_username,
          COUNT(r.id) AS total_reviews,
          AVG(r.rating) AS average_rating,
          COUNT(dt.id) AS units_sold,
          EXISTS (
            SELECT 1 
            FROM transaksi t 
            JOIN detail_transaksi dt ON t.id = dt.transaksi_id 
            WHERE t.user_id = ? 
            AND dt.product_id = p.id 
            AND t.status = 'completed'
          ) as has_purchased
        FROM product p
        LEFT JOIN users u ON p.artist_id = u.id
        LEFT JOIN reviews r ON p.id = r.product_id
        LEFT JOIN detail_transaksi dt ON p.id = dt.product_id
        LEFT JOIN transaksi t ON dt.transaksi_id = t.id AND t.status = 'completed'
        WHERE p.id = ?
        GROUP BY p.id;
        `,
        [userId || 0, id]
      );

      if (products.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const product = products[0];

      // Format data untuk frontend
      const formattedProduct = {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        format: product.format,
        polygon_count: product.polygon_count,
        textures: product.textures,
        rigged: product.rigged,
        specifications: product.specifications,
        
        // Artist info
        artist_id: product.artist_id,
        artist_name: product.artist_name,
        artist_username: product.artist_username,
        
        // Stats
        total_reviews: parseInt(product.total_reviews) || 0,
        average_rating: parseFloat(product.average_rating) || 0,
        units_sold: parseInt(product.units_sold) || 0,
        has_purchased: !!product.has_purchased,
        
        // URLs
        image_url: product.image ? `/img/${product.image}` : null,
        model_url: product.model_path ? `/models/${product.model_path}` : null,
        preview_url: product.preview_path ? `/preview/${product.preview_path}` : null,
      };

      res.status(200).json(formattedProduct);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to retrieve product details' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}