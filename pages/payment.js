import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const CheckoutPage = ({ product, quantity }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/transactions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: [{
            productId: product.id,
            quantity: quantity
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create transaction');
      }

      const { snapToken } = await response.json();

      // Load Midtrans Snap
      window.snap.pay(snapToken, {
        onSuccess: function(result) {
          router.push('/member/orders');
        },
        onPending: function(result) {
          router.push('/member/orders');
        },
        onError: function(result) {
          console.error('Payment failed:', result);
          alert('Payment failed. Please try again.');
        },
        onClose: function() {
          // Handle when customer closes the popup without finishing the payment
          console.log('Customer closed the popup without finishing payment');
        }
      });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          
          {/* Product Summary */}
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={`/img/${product.image}`}
                  alt={product.product_name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{product.product_name}</p>
                  <p className="text-sm text-gray-500">Quantity: {quantity}</p>
                </div>
              </div>
              <p className="font-medium">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(product.price * quantity)}
              </p>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-blue-600">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(product.price * quantity)}
            </span>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;