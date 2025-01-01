import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  console.log('API route hit'); // Debug log
  
  try {

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    if (req.method === 'GET') {
      console.log('Executing GET request'); // Debug log
      
      try {
        const [rows] = await connection.execute(`
          SELECT 
            p.*,
            a.name as artist_name 
          FROM product p
          LEFT JOIN users a ON p.artist_id = a.id
          WHERE a.role = 'artist'
          ORDER BY p.id DESC
        `);

        console.log('Query results:', rows); // Debug log
        
        await connection.end();
        return res.status(200).json(rows);
      } catch (error) {
        console.error('Database error:', error);
        await connection.end();
        return res.status(500).json({ error: 'Failed to fetch products', details: error.message });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}