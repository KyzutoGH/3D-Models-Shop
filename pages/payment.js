import React from 'react';

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information and Shipping */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Contact information</h2>
          <label className="block mb-2 text-sm font-medium">Email address</label>
          <input type="email" className="w-full p-2 border border-gray-300 rounded mb-6" />

          <h2 className="text-lg font-semibold mb-4">Shipping information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">First name</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Last name</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded" />
            </div>
          </div>

          <label className="block mt-4 mb-2 text-sm font-medium">Company</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded mb-4" />

          <label className="block mb-2 text-sm font-medium">Address</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded mb-4" />

          <label className="block mb-2 text-sm font-medium">Apartment, suite, etc.</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded" />
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Order summary</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img src="/black-tshirt.png" alt="Black Tee" className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">Basic Tee</p>
                <p className="text-sm text-gray-500">Black</p>
                <p className="text-sm text-gray-500">Large</p>
              </div>
              <p className="text-sm font-medium">$32.00</p>
            </div>

            <div className="flex items-center space-x-4">
              <img src="/sienna-tshirt.png" alt="Sienna Tee" className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">Basic Tee</p>
                <p className="text-sm text-gray-500">Sienna</p>
                <p className="text-sm text-gray-500">Large</p>
              </div>
              <p className="text-sm font-medium">$32.00</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>$64.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Taxes</span>
              <span>$5.52</span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>$75.52</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
