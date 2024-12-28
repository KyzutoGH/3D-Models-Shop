import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Wrap database query in a Promise
    const checkUser = () => {
      return new Promise((resolve, reject) => {
        db.query(
          'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
          [email],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
    };

    const users = await checkUser();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User exists' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}