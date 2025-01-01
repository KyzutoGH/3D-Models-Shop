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
          p.description,
          p.format,
          p.polygon_count,
          p.textures,
          p.rigged,
          p.specifications,
          u.name as artist_name,
          COUNT(DISTINCT r.id) AS total_reviews,
          COALESCE(AVG(r.rating), 0) AS average_rating,
          COUNT(DISTINCT dt.id) AS units_sold
        FROM product p
        LEFT JOIN users u ON p.artist_id = u.id
        LEFT JOIN reviews r ON p.id = r.product_id
        LEFT JOIN detail_transaksi dt ON p.id = dt.product_id
        GROUP BY 
          p.id, 
          p.name,
          p.image, 
          p.description,
          p.format,
          p.polygon_count,
          p.textures,
          p.rigged,
          p.specifications,
          u.name
        ORDER BY p.createdAt DESC`
      );
      
      // Format data before sending
      const formattedProducts = products.map(product => ({
        ...product,
        average_rating: Number(product.average_rating) || 0,
        total_reviews: Number(product.total_reviews) || 0,
        units_sold: Number(product.units_sold) || 0,
        price: Number(product.price),
        image: product.image || 'placeholder.png', // Default image if none exists
      }));

      res.status(200).json(formattedProducts);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'gagal mengambil product' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}