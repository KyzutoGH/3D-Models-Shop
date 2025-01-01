import db from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const [result] = await db.query(
      `SELECT COUNT(*) as count 
       FROM users 
       WHERE role = 'member' 
       AND tgl_register >= ?`,
      [firstDayOfMonth]
    );

    return res.json({ count: Number(result[0].count) });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: error.message });
  }
}