import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login with:", email, password);

    // Misalnya, setelah login berhasil, kita tentukan role pengguna
    // Role ini bisa didapat dari response API atau sistem autentikasi yang digunakan
    const userRole = email === "admin@example.com" ? "admin" : email === "artist@example.com" ? "artist" : "member";

    // Redirect berdasarkan role
    if (userRole === "admin") {
      router.push("/admin/dashboard");
    } else if (userRole === "artist") {
      router.push("/artist/profile");
    } else {
      router.push("/member/profile");
    }
  };

  const handleGoogleLogin = () => {
    signIn("google");
  };

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // Misalnya, role bisa diambil dari session atau API
      const userRole = session.user.role || "member"; // Default ke member
      if (userRole === "admin") {
        router.push("/admin/dashboard");
      } else if (userRole === "artist") {
        router.push("/artist/profile");
      } else {
        router.push("/member/profile");
      }
    }
  }, [session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-500 w-12 h-12 flex items-center justify-center text-white rounded">
            LOGO
          </div>
          <h1 className="text-2xl text-gray-600 ml-2 font-semibold">PunyaBapak</h1>
        </div>

        <h2 className="text-center text-gray-600 mb-6">Toko Terbaik Dunia Akhirat</h2>

        <div className="mb-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 488 512">
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
