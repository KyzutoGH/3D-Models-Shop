import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      // Validasi parameter ID
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid Product ID' });
      }

      // Query untuk mendapatkan detail produk
      const [products] = await db.execute(
        `
        SELECT 
          p.id AS product_id, 
          p.name AS product_name, 
          p.price, 
          p.image, 
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
          COALESCE(SUM(dt.quantity), 0) AS units_sold 
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
        [id] // Bind parameter untuk ID produk
      );

      // Jika produk tidak ditemukan
      if (products.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const product = products[0];

      // Parsing kolom "format" jika berbentuk string JSON
      if (product.format && typeof product.format === 'string') {
        try {
          product.format = JSON.parse(product.format);
        } catch {
          // Jika gagal parsing, gunakan fallback dengan split string
          product.format = product.format.split(',').map((f) => f.trim());
        }
      }

      // Mengirimkan data produk
      res.status(200).json(product);
    } catch (error) {
      console.error('Database error:', error.message);
      res.status(500).json({ error: 'Failed to retrieve product details' });
    }
  } else {
    // Method yang tidak diizinkan
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
