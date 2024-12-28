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

  switch (req.method) {
    case 'GET':
      try {
        const userQuery = `
          SELECT 
            u.id AS user_id, 
            u.name AS fullName, 
            u.userName AS userName, 
            u.email, 
            u.alamat, 
            u.nomorTelepon AS phoneNumber, 
            u.role, 
            u.tgl_register AS registrationDate,
            COUNT(t.id) AS totalTransactions,
            COALESCE(SUM(t.total_amount), 0) AS totalTransactionValue,
            COALESCE(MAX(t.total_amount), 0) AS largestTransaction
          FROM users u
          LEFT JOIN transaksi t ON u.id = t.user_id AND t.status = "completed"
          WHERE u.id = ?
          GROUP BY u.id
        `;

        const userResults = await queryDatabase(userQuery, [id]);

        if (userResults.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }

        const userRow = userResults[0];
        
        const userData = {
          userId: userRow.user_id,
          fullName: userRow.fullName || 'Belum diisi',
          userName: userRow.userName || 'Belum diisi',
          email: userRow.email,
          alamat: userRow.alamat || 'Belum diisi',
          phoneNumber: userRow.phoneNumber || 'Belum diisi',
          role: userRow.role || 'member',
          registrationDate: userRow.registrationDate
            ? new Date(userRow.registrationDate).toLocaleDateString('id-ID')
            : 'N/A',
          stats: {
            totalTransactions: userRow.totalTransactions || 0,
            totalTransactionValue: userRow.totalTransactionValue || 0,
            largestTransaction: userRow.largestTransaction || 0
          }
        };

        return res.status(200).json(userData);
      } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      
    case 'PUT':
      try {
        const { userName, phoneNumber, alamat } = req.body;
        
        const updateQuery = `
          UPDATE users 
          SET 
            userName = ?,
            nomorTelepon = ?,
            alamat = ?,
            updated_at = NOW()
          WHERE id = ?
        `;
        
        await queryDatabase(updateQuery, [userName, phoneNumber, alamat, id]);
        
        return res.status(200).json({ message: 'Profile updated successfully' });
      } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({ message: 'Failed to update profile' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}