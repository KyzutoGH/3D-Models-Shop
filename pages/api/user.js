// user.js
import jwt from 'jsonwebtoken';
import db from '../../lib/db';

const queryDatabase = async (query, values) => {
  try {
    const [result] = await db.execute(query, values);
    return result;
  } catch (err) {
    throw err;
  }
};

export default async function handler(req, res) {
  const token = req.headers['authorization']?.split(' ')[1]; // ambil token dari header

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    // Verifikasi token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId;

    // Ambil data user dari database
    const user = await queryDatabase('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user: user[0] });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
