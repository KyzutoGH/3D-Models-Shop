import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = '/api/auth';  // Arahkan ke API route untuk login
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
        Login with Google
      </button>
    </div>
  );
};

export default Login;
