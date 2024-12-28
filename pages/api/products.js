import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [products] = await db.execute(
        'SELECT id, name, price, image FROM product'
      );
      
      res.status(200).json(products);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'gagal mengambil product' });
    }
  }
}