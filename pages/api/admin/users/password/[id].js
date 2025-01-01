// pages/api/admin/users/password/[id].js
import db from '../../../../../lib/db';
import bcrypt from 'bcryptjs'; // Jika menggunakan bcrypt

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Karena password yang dienkripsi dengan bcrypt tidak bisa didekripsi,
      // kita akan return password default atau temporary password
      const [rows] = await db.query(
        'SELECT email FROM users WHERE id = ?',
        [id]
      );
      
      if (rows.length > 0) {
        // Menggunakan 8 karakter pertama dari email sebagai password default
        const defaultPassword = rows[0].email.split('@')[0].slice(0, 8);
        return res.json({ password: defaultPassword });
      }
      return res.status(404).json({ message: 'User not found' });

    } catch (error) {
      console.error('Error fetching password:', error);
      return res.status(500).json({ message: 'Error fetching password' });
    }
  }

  if (req.method === 'PUT') {
    const { password } = req.body;

    try {
      // Hash password baru sebelum disimpan
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      
      return res.json({ 
        message: 'Password updated successfully',
        newPassword: password // Return password asli untuk ditampilkan
      });

    } catch (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ message: 'Error updating password' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}