import React, { useState, useEffect } from 'react';
import { getSession, signOut } from 'next-auth/react';
import {useRouter} from "next/router";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // Jika pengguna tidak login, arahkan ke halaman login
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Periksa apakah pengguna memiliki role yang sesuai
  if (session.user.role !== 'admin' && session.user.role !== 'artist') {
    return {
      redirect: {
        destination: '/error401', // Arahkan pengguna ke halaman profil jika bukan admin atau seller
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

const Profile = ({ session }) => {
  const router = useRouter();

  const user = session?.user || {};
  const [greeting, setGreeting] = useState('');
  const [formData, setFormData] = useState({
    username: user.name || '',
    phoneNumber: user.hp || '',
    email: user.email || '',
    alamat: user.alamat || '',
    fullName: user.fullName || '',
    registrationDate: user.tgl_register || '',
    transactionStatus: '0',
    totalNominalTransaction: '0',
    totalTransaction: '0',
  });

  useEffect(() => {
        // Periksa token di localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login"); // Redirect jika tidak ada token
        } else {
          // Validasi token di server jika diperlukan
          fetch("/api/validate-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error("Token invalid");
              }
            })
            .catch(() => {
              localStorage.removeItem("token"); // Hapus token jika tidak valid
              router.push("/login"); // Redirect ke login
            });
        }
        console.log(token);

    const currentHour = new Date().getHours();
    let greetingMessage = '';

    if (currentHour >= 5 && currentHour < 10) {
      greetingMessage = 'Selamat Pagi';
    } else if (currentHour >= 10 && currentHour < 15) {
      greetingMessage = 'Selamat Siang';
    } else if (currentHour >= 15 && currentHour < 18) {
      greetingMessage = 'Selamat Sore';
    } else {
      greetingMessage = 'Selamat Malam';
    }

    setGreeting(greetingMessage);

    const fetchData = async () => {
      if (user.id) {
        try {
          const response = await fetch(`/api/user/${user.id}`, { timeout: 10000 });
          if (!response.ok) {
            throw new Error('Gagal mengambil data pengguna');
          }
          const data = await response.json();
          console.log('Fetched data:', data);
          if (data) {
            setFormData((prevData) => ({
              ...prevData,
              fullName: data.fullName || prevData.fullName,
              alamat: data.alamat || prevData.alamat,
              registrationDate: data.registrationDate ? new Date(data.registrationDate).toLocaleDateString('id-ID') : 'Tunggu data',
              transactionStatus: data.transactionStatus || prevData.transactionStatus,
              totalNominalTransaction: data.totalNominalTransaction || prevData.totalNominalTransaction,
              totalTransaction: data.totalTransaction || prevData.totalTransaction,
              phoneNumber: data.phoneNumber || prevData.phoneNumber,
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchData();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onLogout = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        await signOut({ 
          callbackUrl: '/login',
          redirect: true 
        });
      } else {
        console.error('Logout failed on server side');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-blue-500 text-white p-6 w-full max-w-3xl">
        <div className="flex justify-between mb-3">
          <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center">
            <span className="text-blue-500 font-bold">PP</span>
          </div>
          <h1 className="grid justify-items-center text-2xl font-bold">Pencarian</h1>
          <div className="justify-center flex items-center">
            <p className="font-medium">{greeting}, {user.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col items-center gap-5 pt-8">
            <div className="box-border h-32 w-32 p-4 border-2 bg-green-400">
              Foto Anda Disini
            </div>
            <div className="box-border h-10 w-32 p-4 border-2 bg-red-500">
              Ganti Foto
            </div>
            <div className="box-border h-10 w-32 p-4 border-2 bg-amber-400">
              Status Akun
            </div>
          </div>

          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block font-medium mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md"
                  disabled
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="alamat" className="block font-medium mb-2">
                  Alamat
                </label>
                <input
                  type="text"
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="fullName" className="block font-medium mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="registrationDate" className="block font-medium mb-2">
                  Tanggal Daftar
                </label>
                <input
                  type="text"
                  id="registrationDate"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="transactionStatus" className="block font-medium mb-2">
                  Jumlah Transaksi
                </label>
                <input
                  type="text"
                  id="transactionStatus"
                  name="transactionStatus"
                  value={formData.transactionStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="totalNominalTransaction" className="block font-medium mb-2">
                  Total Nominal Transaksi
                </label>
                <input
                  type="text"
                  id="totalNominalTransaction"
                  name="totalNominalTransaction"
                  value={formData.totalNominalTransaction}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="totalTransaction" className="block font-medium mb-2">
                  Total Transaksi
                </label>
                <input
                  type="text"
                  id="totalTransaction"
                  name="totalTransaction"
                  value={formData.totalTransaction}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md"
                  disabled
                />
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={onLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Keluar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
