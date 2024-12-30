// pages/payment/[id].js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { ArrowLeft } from 'lucide-react';

const PaymentPage = () => {
  const router = useRouter();
  const { id, quantity } = router.query;
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Redirect jika tidak ada session
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Load Midtrans Snap
    const script = document.createElement('script');
    script.src = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL;
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const createOrder = async () => {
      if (id && quantity && session?.user && !isProcessing && !orderDetails) {
        try {
          setIsProcessing(true);
          setLoading(true);
          console.log('Creating order with:', { id, quantity });

          const response = await fetch('/api/transaksi/transaksi', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: id,
              quantity: parseInt(quantity)
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create order');
          }

          const data = await response.json();
          setOrderDetails(data);
          console.log('Opening Snap payment with token:', data.snapToken);

          // Open Snap payment page
          window.snap.pay(data.snapToken, {
            onSuccess: function(result) {
              console.log('Payment success:', result);
              router.push('/member/transaksi');
            },
            onPending: function(result) {
              console.log('Payment pending:', result);
              router.push('/member/transaksi');
            },
            onError: function(result) {
              console.error('Payment failed:', result);
              setError('Payment failed. Please try again.');
            },
            onClose: function() {
              console.log('Snap payment closed');
              router.push(`/product/${id}`);
            }
          });
        } catch (error) {
          console.error('Error creating order:', error);
          setError('Failed to create order. Please try again.');
          setIsProcessing(false);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session && !orderDetails && !isProcessing) {
      createOrder();
    }
  }, [id, quantity, session, isProcessing, orderDetails, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparing your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push(`/product/${id}`)}
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Product</span>
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to continue</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Processing Payment | PunyaBapak</title>
        <meta name="description" content="Processing your payment" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Initializing payment gateway...</p>
          {orderDetails && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Order ID: {orderDetails.orderId}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentPage;