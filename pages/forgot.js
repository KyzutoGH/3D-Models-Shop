import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const LupaPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Link reset password telah dikirim ke email Anda");
      } else {
        setError(data.message || "Gagal mengirim link reset password");
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white w-12 h-12 flex items-center justify-center text-white rounded">
            <Image
              src="/Logo3DShopBL.png"
              width={580}
              height={430}
              alt="Picture of the author"
            />
          </div>
          <h1 className="text-2xl text-gray-600 ml-2 font-semibold">PunyaBapak</h1>
        </div>

        <h2 className="text-center text-gray-600 mb-6">Reset Password</h2>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan email Anda"
              required
            />
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Kirim Link Reset Password
            </button>
            
            <div className="flex justify-center text-sm text-gray-600">
              Kembali ke 
              <Link href="/login" className="ml-1 text-blue-600 hover:underline">
                &nbsp;Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LupaPasswordPage;