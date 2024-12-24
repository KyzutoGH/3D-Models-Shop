// pages/api/users/[id].js
import db from '../../../lib/db';

const queryDatabase = async (query, values) => {
  try {
    const [results] = await db.execute(query, values);
    return results;
  } catch (err) {
    throw err;
  }
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Id parameter is required' });
  }

  // Handle GET request
  if (req.method === 'GET') {
    try {
      const results = await queryDatabase(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = results[0];

      const registrationDate = user.tgl_register
        ? new Date(user.tgl_register).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'N/A';

      return res.status(200).json({
        fullName: user.userName || 'Belum diisi',
        email: user.email,
        registrationDate: registrationDate,
        alamat: user.alamat || 'Belum diisi',
        phoneNumber: user.nomorTelepon || 'Belum diisi',
        role: user.role || 'N/A',
      });
    } catch (error) {
      console.error('Database error:', error.message);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // Handle PUT request
  if (req.method === 'PUT') {
    const { fullName, phoneNumber, email, alamat } = req.body;

    try {
      const updateQuery = `
        UPDATE users 
        SET 
          userName = ?,
          nomorTelepon = ?,
          email = ?,
          alamat = ?,
          tgl_update = NOW()
        WHERE id = ?
      `;

      await queryDatabase(updateQuery, [
        fullName,
        phoneNumber,
        email,
        alamat,
        id
      ]);

      // Fetch updated user data
      const updatedUser = await queryDatabase(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      if (updatedUser.length === 0) {
        return res.status(404).json({ message: 'User not found after update' });
      }

      const user = updatedUser[0];
      const registrationDate = user.tgl_register
        ? new Date(user.tgl_register).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'N/A';

      return res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          fullName: user.userName || 'Belum diisi',
          email: user.email,
          registrationDate: registrationDate,
          alamat: user.alamat || 'Belum diisi',
          phoneNumber: user.nomorTelepon || 'Belum diisi',
          role: user.role || 'N/A',
        }
      });
    } catch (error) {
      console.error('Update error:', error.message);
      return res.status(500).json({
        message: 'Error updating profile',
        error: error.message,
      });
    }
  }

  // Handle unsupported HTTP methods
  return res.status(405).json({ message: 'Method not allowed' });
}