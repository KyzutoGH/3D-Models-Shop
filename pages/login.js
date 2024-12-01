// pages/login.js
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const handleLogin = () => {
    signIn("google");  // Trigger Google OAuth login
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
        
        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
