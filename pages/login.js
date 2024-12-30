import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && status === "authenticated") {
      redirectBasedOnRole(session.user.role);
    }
  }, [session, status]);

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "artist":
        router.push("/artist/dashboard");
        break;
      default:
        router.push("/member/");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!emailOrUsername || !password) {
      setError("Email/Username dan Password harus diisi");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        emailOrUsername: emailOrUsername,
        password: password,
      });

      if (result?.error) {
        setError("Email/Username atau password salah");
      } else if (result?.ok) {
        const session = await getSession();
        if (session) {
          redirectBasedOnRole(session.user.role);
        }
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signIn("google", { callbackUrl: "/api/auth/callback/google" });
    } catch (error) {
      setError("Gagal login dengan Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-slate-800 w-12 h-12 flex items-center justify-center text-white rounded">
            <Image src="/IconShopBlk.png" width={580} height={430} alt="Logo" />
          </div>
          <h1 className="text-2xl text-yellow-700 ml-2 font-semibold">PunyaBapak</h1>
        </div>

        <h2 className="text-center text-yellow-700 mb-6">Toko Terbaik Dunia Akhirat</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="emailOrUsername" className="block text-sm font-medium text-yellow-700 mb-1">
              Email atau Username
            </label>
            <input
              type="text"
              id="emailOrUsername"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan email atau username"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-yellow-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan password"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>

            <div className="flex gap-3">
              <Link href="/register" className="w-1/2">
                <button
                  type="button"
                  className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                  disabled={loading}
                >
                  Register
                </button>
              </Link>

              <Link href="/forgot" className="w-1/2">
                <button
                  type="button"
                  className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                  disabled={loading}
                >
                  Lupa Password?
                </button>
              </Link>
            </div>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-orange-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-orange-300 text-black">Atau</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50"
          disabled={loading}
        >
          <Image src="/google.png" width={20} height={20} alt="Google Icon" />
          Login dengan mbah Google
        </button>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    const pathname = context.req.url;
    if (pathname.includes('/login')) {
      const redirectPath = getRedirectPath(session.user.role);
      return {
        redirect: {
          destination: redirectPath,
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      session: session || null,
    },
  };
}

function getRedirectPath(role) {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "artist":
      return "/artist/profile";
    default:
      return "/member/profile";
  }
}

export default LoginPage;