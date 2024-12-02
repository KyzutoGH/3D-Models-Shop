import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login', // Redirect to login page if no session
        permanent: false,
      },
    };
  }

  return {
    props: {
      session, // Pass session as a prop
    },
  };
}

const Profile = ({ session }) => {
  const user = session?.user || {};
  const [greeting, setGreeting] = useState('');

  const [formData, setFormData] = useState({
    username: user.name || '',
    phoneNumber: user.hp || '',
    email: user.email || '',
    alamat: 'Tolong segera isi jika belum ada',
    fullName: 'Tolong segera isi jika belum ada',
    registrationDate: user.tgl_register || '',
    transactionStatus: '0',
    totalNominalTransaction: '0',
    totalTransaction: '0',
  });

  useEffect(() => {
    // Determine the greeting based on the time of day
    const currentHour = new Date().getHours();
    let greetingMessage = '';

    if (currentHour >= 5 && currentHour < 10) {
      greetingMessage = 'Selamat Pagi'; // Morning (5 AM - 10 AM)
    } else if (currentHour >= 10 && currentHour < 15) {
      greetingMessage = 'Selamat Siang'; // Afternoon (10 AM - 3 PM)
    } else if (currentHour >= 15 && currentHour < 18) {
      greetingMessage = 'Selamat Sore'; // Evening (3 PM - 6 PM)
    } else {
      greetingMessage = 'Selamat Malam'; // Night (6 PM - 5 AM)
    }

    setGreeting(greetingMessage);

    // Fetch user data if email is available
    const fetchData = async () => {
      if (user.email) {
        try {
          const response = await fetch(`/api/user/${user.email}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const data = await response.json();
          console.log(data); // Log API response for debugging

          if (data) {
            setFormData((prevData) => ({
              ...prevData,
              fullName: data.fullName || prevData.fullName,
              alamat: data.alamat || prevData.alamat,
              registrationDate: data.registrationDate || prevData.registrationDate,
              transactionStatus: data.transactionStatus || prevData.transactionStatus,
              totalNominalTransaction: data.totalNominalTransaction || prevData.totalNominalTransaction,
              totalTransaction: data.totalTransaction || prevData.totalTransaction,
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchData();
  }, [user.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission (e.g., save the updated data to the server)
    console.log(formData);

    // Example of an API request to submit the form (you can implement your own API endpoint)
    try {
      const response = await fetch('/api/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-blue-500 text-white p-6 w-full max-w-4xl">
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
          <div className="flex justify-center flex-col items-center gap-5 pt-8">
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                />
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;