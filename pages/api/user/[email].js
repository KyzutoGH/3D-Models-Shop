import db from '../../../lib/db'; // Ensure correct import path for your DB connection

// Promisify the database query to use async/await
const queryDatabase = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) return reject(err); // Reject on error
      resolve(results); // Resolve with the query result
    });
  });
};

export default async function handler(req, res) {
  const { email } = req.query; // Get the dynamic email parameter from the URL
  
  // Validate email parameter
  if (!email) {
    return res.status(400).json({ message: 'Email parameter is required' });
  }

  try {
    // Query to fetch user details by email
    const results = await queryDatabase('SELECT name, email, tgl_register, role FROM users WHERE email = ?', [email]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Format the registration date
    const registrationDate = user.tgl_register 
      ? new Date(user.tgl_register).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'N/A';

    // Send response with user details
    return res.status(200).json({
      fullName: user.name || 'No name available',
      email: user.email,
      registrationDate: registrationDate,
      role: user.role || 'N/A',
    });
  } catch (error) {
    // Log and return an error response in case of failure
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
