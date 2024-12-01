import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();  // Prevent the form from refreshing the page

    // Here you would typically handle the login logic, such as API calls
    console.log('Logging in with:', email, password);

    // Redirect to the API route for login
    window.location.href = '/api/auth'; // or handle with fetch/axios
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-500 w-12 h-12 flex items-center justify-center text-white rounded">
            LOGO
          </div>
          <h1 className="text-2xl text-gray-600 ml-2 font-semibold">PunyaBapak.care</h1>
        </div>
        
        <h2 className="text-center text-gray-600 mb-6">Toko Terbaik Dunia Akhirat</h2>
        
        <form className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username/Email/Telepon"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-between gap-2">
            <button
              type="button"
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Register
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Lupa?
            </button>
          </div>
          
          <button
          onClick={handleLogin}
            type="button"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors mt-4"
          >
            Login dengan Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;