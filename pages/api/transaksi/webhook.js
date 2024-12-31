import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    
    const status = req.body.transaction_status === 'settlement' ? 'completed' : 
                  ['capture', 'deny', 'cancel', 'expire'].includes(req.body.transaction_status) ? 'failed' : 
                  'pending';

    await connection.execute(
      'UPDATE transaksi SET status = ? WHERE order_id = ?',
      [status, req.body.order_id]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
}