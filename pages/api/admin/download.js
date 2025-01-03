// pages/api/dashboards/[type].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { type } = req.query;
  
  try {
    // Koneksi ke database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Query untuk mendapatkan data
    const query = `
      SELECT 
        d.id,
        d.download_date,
        p.name as product_name,
        p.price,
        p.format,
        u.name as user_name
      FROM downloads d
      JOIN product p ON d.product_id = p.id
      JOIN users u ON d.user_id = u.id
      ORDER BY d.download_date DESC
    `;

    // Eksekusi query
    const [rows] = await connection.execute(query);

    // Format data hasil query
    const formattedDownloads = rows.map(download => ({
      id: download.id,
      downloadDate: download.download_date,
      productName: download.product_name,
      price: download.price,
      format: download.format,
      userName: download.user_name
    }));

    // Tutup koneksi
    await connection.end();

    // Kirim response
    res.status(200).json(formattedDownloads);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
