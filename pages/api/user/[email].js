import db from '../../../lib/db'; // Make sure to import your database connection

export default async function handler(req, res) {
  const { email } = req.query;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ message: 'Email parameter is required' });
  }

  try {
    // Query to fetch user details by email using Promise-based database query
    const results = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, results) => {
          if (err) {
            reject(err); // Reject the promise if an error occurs
          } else {
            resolve(results); // Resolve the promise with query results
          }
        }
      );
    });

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    return res.status(200).json({
      fullName: user.name || 'No name available',
      email: user.email,
      registrationDate: user.tgl_register || 'N/A',
      role: user.role || 'N/A',
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
