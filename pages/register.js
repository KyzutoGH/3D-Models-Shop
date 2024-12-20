import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [isGoogleRegister, setIsGoogleRegister] = useState(false);
  const [userNameError, setUserNameError] = useState(""); // For userName error message

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Check if the user is being redirected from Google SignIn
    if (router.query.google === "true") {
      setEmail(router.query.email || "");  // Autofill email from query params
      setName(router.query.name || "");    // Autofill name from query params
      setIsGoogleRegister(true);  // Mark this as a Google registration
    }
  }, [router.query]);

  if (session) {
    return <p>You are already logged in!</p>;
  }

  // Validate the userName
  const validateUserName = (name) => {
    const userNameRegex = /^[a-z0-9_-]+$/; // Only lowercase letters, numbers, '-' and '_'
    if (!userNameRegex.test(name)) {
      setUserNameError("Username hanya boleh mengandung huruf kecil, angka, dan simbol '-' atau '_'. Tidak boleh mengandung spasi atau huruf kapital.");
      return false;
    }
    setUserNameError(""); // Clear error if valid
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate the userName before proceeding with registration
    if (!validateUserName(userName)) {
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Send data to the register API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          userName,
          password,
          nomorTelepon,
        }),
      });

      if (response.ok) {
        // Redirect to login page on success
        router.push('/login');
      } else {
        // Handle error from the API
        const errorData = await response.json();
        alert(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration");
    }
  };

  const handleGoogleRegister = () => {
    signIn("google", { callbackUrl: '/profile' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white w-12 h-12 flex items-center justify-center text-white rounded">
            <Image
              src="/IconShopBlk.png"
              width={580}
              height={430}
              alt="Picture of the author"
            />
          </div>
          <h1 className="text-2xl text-gray-600 ml-2 font-semibold">PunyaBapak</h1>
        </div>

        <h2 className="text-center text-gray-600 mb-6">Toko Terbaik Dunia Akhirat</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Nama */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan nama Anda"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
              UserName
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan UserName Anda"
              required
            />
            {/* Display error message if validation fails */}
            {userNameError && <p className="text-sm text-red-500 mt-1">{userNameError}</p>}
          </div>

          {/* Email */}
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
              disabled={isGoogleRegister} // Disable email input if Google login
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Buat password"
              required
              minLength={6}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Ulangi password"
              required
              minLength={6}
            />
          </div>

          {/* Nomor Telepon */}
          <div>
            <label htmlFor="nomorTelepon" className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon
            </label>
            <input
              type="text"
              id="nomorTelepon"
              value={nomorTelepon}
              onChange={(e) => setNomorTelepon(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan nomor telepon"
              required
              minLength={6}
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Registrasi
            </button>

            <div className="flex justify-center text-sm text-gray-600">
              Sudah punya akun?
              <Link href="/login" className="ml-1 text-blue-600 hover:underline">
                &nbsp;Login
              </Link>
            </div>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Atau</span>
          </div>
        </div>

        <button
          onClick={handleGoogleRegister}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 488 512">
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
          Daftar dengan Google
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
