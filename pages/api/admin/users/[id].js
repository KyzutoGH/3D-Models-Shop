// pages/api/admin/artist/[id].js
import db from '../../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    return res.status(200).json({ message: 'Users deleted successfully' });
  } catch (error) {
    console.error('Error deleting artist:', error);
    return res.status(500).json({ message: 'Error deleting artist' });
  }
}