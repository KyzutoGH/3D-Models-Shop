// pages/api/dashboards/[type].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { type } = req.query;
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    let query;
    switch (type) {
      case 'admin':
        query = `
          SELECT id, email, name, role, tgl_register 
          FROM users 
          WHERE role = 'admin'
        `;
        break;
      
      case 'artist':
        query = `
          SELECT id, email, name, role, tgl_register 
          FROM users 
          WHERE role = 'artist'
        `;
        break;
      
      case 'member':
        query = `
          SELECT id, email, name, role, tgl_register 
          FROM users 
          WHERE role = 'member'
        `;
        break;
      
      default:
        return res.status(400).json({ error: 'Invalid type parameter' });
    }

    const [rows] = await connection.execute(query);
    await connection.end();
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}