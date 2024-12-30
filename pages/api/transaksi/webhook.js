// pages/api/transaksi/webhook.js
import { snap } from '../../../src/config/midtrans';
import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const notification = await snap.transaction.notification(req.body);
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const paymentType = notification.payment_type;

    let status;
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        status = 'pending';
      } else if (fraudStatus === 'accept') {
        status = 'completed';
      }
    } else if (transactionStatus === 'settlement') {
      status = 'completed';
    } else if (transactionStatus === 'cancel' ||
               transactionStatus === 'deny' ||
               transactionStatus === 'expire') {
      status = 'failed';
    } else if (transactionStatus === 'pending') {
      status = 'pending';
    }

    // Extract transaction ID from order_id (remove 'TRX-' prefix)
    const transactionId = orderId.replace('TRX-', '');

    await db.execute(
      'UPDATE transaksi SET status = ?, payment_type = ? WHERE id = ?',
      [status, paymentType, transactionId]
    );

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}