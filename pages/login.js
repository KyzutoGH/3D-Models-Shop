import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    adminEmail: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && status === "authenticated") {
      redirectBasedOnRole(session.user.role);
    }
  }, [session, status]);

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case "admin": router.push("/admin/");
        break;
      case "artist": router.push("/artist/dashboard");
        break;
      default: router.push("/member/");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.emailOrUsername || !formData.password) {
      setError("Email/Username dan Password harus diisi");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
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

  const handleSendEmail = async () => {
    if (!formData.adminEmail) {
      setError("Email harus diisi");
      return;
    }
    
    try {
      const response = await fetch('/api/send-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.adminEmail }),
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      setError("Gagal mengirim email ke admin");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEmailSent(false);
    setFormData(prev => ({ ...prev, adminEmail: "" }));
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-slate-800 p-6 rounded-lg shadow-md w-full max-w-sm">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8">
            <Image src="/IconShopBlk.png" width={580} height={430} alt="Logo" />
          </div>
          <h1 className="text-xl text-yellow-700 ml-2 font-semibold">PunyaBapak</h1>
        </div>

        {error && (
          <div className="mb-3 p-2 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-yellow-700">Email atau Username</label>
            <input
              type="text"
              id="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-1.5 text-sm border border-gray-300 rounded"
              placeholder="Email atau username"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-yellow-700">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-1.5 text-sm border border-gray-300 rounded"
              placeholder="Password"
              required
              disabled={loading}
            />
          </div>

<div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full bg-yellow-500 text-slate-900 py-2.5 rounded-md hover:bg-yellow-400 transition-colors text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <Link href="/register" className="block">
              <button
                type="button"
                className="w-full bg-transparent border-2 border-yellow-500 text-yellow-500 py-2 rounded-md hover:bg-yellow-500 hover:text-slate-900 transition-all text-sm font-semibold disabled:opacity-50"
                disabled={loading}
              >
                Register
              </button>
            </Link>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-orange-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-orange-300 text-black">Atau</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white text-sm border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <Image src="/google.png" width={16} height={16} alt="Google Icon" />
          Login dengan Google
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
    case "admin": return "/admin/";
    case "artist": return "/artist/dashboard";
    default: return "/member/profile";
  }
}

export default LoginPage;