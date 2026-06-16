import midtransClient from 'midtrans-client';

export const snap = new midtransClient.Snap({
  isProduction: false, // Set ke false karena kita masih pakai mode Sandbox (testing)
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});