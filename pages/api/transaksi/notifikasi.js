// pages/api/transaksi/notification.js
import db from '../../../lib/db';

export default async function handler(req, res) {
 let connection;
 try {
   connection = await db.getConnection();
   await connection.beginTransaction();

   // Langsung update ke completed
   await connection.execute(
     'UPDATE transaksi SET status = ?, payment_time = NOW(), updated_at = NOW() WHERE status = ?',
     ['completed', 'pending']
   );

   // Update stok produk
   const [details] = await connection.execute(
     'SELECT dt.product_id, dt.quantity FROM transaksi t JOIN detail_transaksi dt ON t.id = dt.transaksi_id WHERE t.status = ?',
     ['completed'] 
   );

   for (const detail of details) {
     await connection.execute(
       'UPDATE product SET stock = stock - ? WHERE id = ?',
       [detail.quantity, detail.product_id]
     );
   }

   await connection.commit();
   res.status(200).json({ status: 'OK' });

 } catch (error) {
   if (connection) await connection.rollback();
   res.status(500).json({ error: error.message });
 } finally {
   if (connection) connection.release();
 }
}