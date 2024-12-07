import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login with:", email, password);

    // Tentukan role pengguna berdasarkan email
    const userRole =
      email === "admin@example.com"
        ? "admin"
        : email === "artist@example.com"
        ? "artist"
        : "member";

    // Redirect berdasarkan role
    if (userRole === "admin") {
      router.push("/admin/dashboard");
    } else if (userRole === "artist") {
      router.push("/artist/profile");
    } else {
      router.push("/member/profile");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    // Kirim credentialResponse ke backend Anda untuk autentikasi dan mendapatkan user role
    console.log("Google Login Success:", credentialResponse);
    const token = credentialResponse.credential; // Token dari Google
    // Simpan token di localStorage (atau gunakan cookie untuk server-side auth)
    localStorage.setItem("token", token);
    // Tentukan role pengguna
    const userRole = "member"; // Dapatkan dari backend setelah validasi
    localStorage.setItem("role", userRole); // Simpan role

    // Simulasikan redirect role pengguna
    console.log("Redirecting user based on role:", userRole);
    if (userRole === "admin") {
    await router.push("/admin/dashboard");
    } else if (userRole === "artist") {
    await router.push("/artist/profile");
    } else {
    await router.push("/member/profile");
    console.log("Redirected to:", window.location.href);
    }
    console.log(userRole)
    console.log("Redirect attempted"); 
  }; 

  const handleGoogleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
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

          <h2 className="text-center text-gray-600 mb-6">Toko Terbaik Dunia Akhirat</h2>

          <div className="mb-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Login
                </button>

                <div className="flex gap-3">
                  <Link href="/register" className="w-1/2">
                    <button
                      type="button"
                      className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                    >
                      Register
                    </button>
                  </Link>

                  <Link href="/forgot" className="w-1/2">
                    <button
                      type="button"
                      className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                    >
                      Lupa Password?
                    </button>
                  </Link>
                </div>
              </div>
            </form>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Atau</span>
            </div>
          </div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;