import midtransClient from 'midtrans-client';

const isProduction = process.env.NODE_ENV === 'production';

export const snap = new midtransClient.Snap({
    isProduction: isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});