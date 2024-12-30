import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [transactions] = await db.execute(`
      SELECT 
        t.id,
        t.total_amount,
        t.status,
        t.created_at,
        t.payment_type,
        p.id as product_id,
        p.name as product_name,
        p.image as product_image
      FROM transaksi t
      JOIN detail_transaksi dt ON t.id = dt.transaksi_id
      JOIN product p ON dt.product_id = p.id
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
    `, [session.user.id]);

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}