import db from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const [newProducts] = await db.query(
      `SELECT COUNT(*) as count 
       FROM product 
       WHERE createdAt >= ?`,
      [firstDayOfMonth]
    );

    const [popularProducts] = await db.query(
      `SELECT p.name, COUNT(t.id) as sales
       FROM product p
       LEFT JOIN transaksi t ON t.order_id = p.id
       WHERE t.status = 'completed'
       GROUP BY p.id, p.name
       ORDER BY sales DESC
       LIMIT 10`
    );

    return res.json({
      count: Number(newProducts[0].count),
      popular: popularProducts.map(row => ({
        name: row.name,
        sales: Number(row.sales)
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: error.message });
  }
}