import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    nomorTelepon: "",
  });
  const [userNameError, setUserNameError] = useState("");
  const [showGoogleButton, setShowGoogleButton] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (router.query.google === "true" && router.query.newUser === "true") {
      setFormData(prev => ({
        ...prev,
        email: router.query.email || "",
        name: router.query.name || "",
      }));
      setShowGoogleButton(true);
    }
  }, [router.query]);

  if (session) {
    return <p>You are already logged in!</p>;
  }

  const validateUserName = (name) => {
    const userNameRegex = /^[a-z0-9_-]+$/;
    if (!userNameRegex.test(name)) {
      setUserNameError("Username hanya boleh mengandung huruf kecil, angka, dan simbol '-' atau '_'");
      return false;
    }
    setUserNameError("");
    return true;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateUserName(formData.userName)) return;
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isGoogleRegister: showGoogleButton
        }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-slate-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8">
            <Image src="/IconShopBlk.png" width={580} height={430} alt="Logo" />
          </div>
          <h1 className="text-xl text-yellow-700 ml-2 font-semibold">PunyaBapak</h1>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-2 gap-3">
          <div className="col-span-2 md:col-span-1">
            <label className="text-xs font-medium text-yellow-700">Nama</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              placeholder="Nama"
              required
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="text-xs font-medium text-yellow-700">Username</label>
            <input
              type="text"
              id="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              placeholder="Username"
              required
            />
            {userNameError && <p className="text-xs text-red-500 mt-0.5">{userNameError}</p>}
          </div>

          <div className="col-span-2">
            <label className="text-xs font-medium text-yellow-700">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              placeholder="Email"
              required
              disabled={showGoogleButton}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="text-xs font-medium text-yellow-700">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              placeholder="Password"
              required
              minLength={6}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="text-xs font-medium text-yellow-700">Konfirmasi</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              placeholder="Konfirmasi Password"
              required
              minLength={6}
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs font-medium text-yellow-700">Nomor Telepon</label>
            <input
              type="text"
              id="nomorTelepon"
              value={formData.nomorTelepon}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              placeholder="Nomor Telepon"
              required
            />
          </div>

          <div className="col-span-2 mt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Registrasi
            </button>
          </div>

          <div className="col-span-2 text-center text-xs text-yellow-600">
            Sudah punya akun?
            <Link href="/login" className="ml-1 text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;