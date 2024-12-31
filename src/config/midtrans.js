// src/config/midtrans.js
import midtransClient from 'midtrans-client';

// Create Snap API instance
const snap = new midtransClient.Snap({
    isProduction: process.env.NODE_ENV === 'production',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export { snap };