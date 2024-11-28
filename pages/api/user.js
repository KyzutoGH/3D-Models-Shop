import jwt from 'jsonwebtoken';
import db from '../../lib/db';

export default function handler(req, res) {
  const token = req.headers['authorization']?.split(' ')[1]; // ambil token dari header

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Verifikasi token JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });

    const userId = decoded.userId;

    // Ambil data user dari database
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(200).json({ user: result[0] });
    });
  });
}
