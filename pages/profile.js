import React, { useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    alamat: '',
    registrationDate: '',
    transactionStatus: '',
    totalNominalTransaction: '',
    totalTransaction: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/register', formData);
      // Handle successful registration
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle registration error
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-blue-500 text-white p-6  w-full max-w-4xl">
        <div class="flex justify-between mb-3">
          <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center">
            <span className="text-blue-500 font-bold">PP</span>
          </div>
          <h1 className="grid justify-items-center flex items-center text-2xl font-bold">Pencarian</h1>
          <div className="justify-center flex items-center">
            <p className="font-medium">Selamat Pagi</p>
          </div>
        </div>
        <div class="grid grid-rows-1 grid-flow-col gap-2">
        <div class="row-span-2 grid-cols-1 flex justify-start flex-col items-center gap-5 pt-8">
        <div class="box-border h-32 w-32 p-4 border-2 bg-green-400">
          foto anda disini
        </div>
        <div class="box-border h-10 w-32 p-4 border-2 bg-red-500">
          ganti foto
        </div>
        <div class="box-border h-10 w-32 p-4 border-2 bg-amber-400">
          status akun
        </div>
        </div>
        <form onSubmit={handleSubmit}> 
        <div className="grid grid-cols-2 gap-4">
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
              />
            </div>
          </div>
        <div class="grid-cols-3">
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
                Transaksi Terbesar
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
            <div class="grid justify-items-end mt-5">
            <button
              type="submit"
              className="bg-white text-blue-500 px-4 py-2 rounded-md font-medium hover:bg-gray-200">
              Submit
            </button>
            </div>
        </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;