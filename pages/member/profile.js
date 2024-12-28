import React, { useState, useEffect } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from "next/router";
import {
  UserCircle, Camera, Badge, LogOut, Phone, Mail, MapPin, User,
  Calendar, ShoppingBag, CreditCard, TrendingUp, Shield, Palette,
  Edit2, Check, X, ArrowLeft
} from 'lucide-react';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: { session } };
}

const Profile = ({ session }) => {
  const router = useRouter();
  const user = session?.user || {};
  const [greeting, setGreeting] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    alamat: '',
    phoneNumber: '',
    role: 'member',
    registrationDate: '',
    stats: {
      totalTransactions: 0,
      totalTransactionValue: 0,
      largestTransaction: 0
    }
  });

  useEffect(() => {
    const currentHour = new Date().getHours();
    let greetingMessage = '';
    if (currentHour >= 5 && currentHour < 10) greetingMessage = 'Selamat Pagi';
    else if (currentHour >= 10 && currentHour < 15) greetingMessage = 'Selamat Siang';
    else if (currentHour >= 15 && currentHour < 18) greetingMessage = 'Selamat Sore';
    else greetingMessage = 'Selamat Malam';
    setGreeting(greetingMessage);
  }, []);

  useEffect(() => {
    if (!user.id) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user.id]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          alamat: userData.alamat,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getBadgeContent = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return {
          Icon: Shield,
          color: 'text-red-500',
          bgColor: 'bg-red-50'
        };
      case 'artist':
        return {
          Icon: Palette,
          color: 'text-purple-500',
          bgColor: 'bg-purple-50'
        };
      case 'member':
        return {
          Icon: User,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50'
        };
      default:
        return {
          Icon: User,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50'
        };
    }
  };
  // Lanjutan component Profile

  const { Icon, color, bgColor } = getBadgeContent(userData.role);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Halaman Profil
                </h1>
                <p className="text-gray-600">{greeting}, {userData.fullName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/member/')}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Info Card */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserCircle className="w-16 h-16 text-gray-400" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-800">
                    {userData.userName}
                  </h2>
                  <p className="text-gray-600">{userData.email}</p>
                  <div className="mt-4 flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${bgColor}`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <span className="text-sm text-gray-600">
                      Anda sebagai {userData.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Profile Info Section */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Informasi Pribadi
                  </h2>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="flex items-center space-x-2 text-green-500 hover:text-green-600"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center space-x-2 text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                        <span>Batal</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isEditing ? (
                    <>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-500">Nama Lengkap</label>
                          <input
                            name="fullName"
                            value={userData.fullName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Nomor Telepon</label>
                          <input
                            name="phoneNumber"
                            value={userData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Alamat</label>
                          <input
                            name="alamat"
                            value={userData.alamat}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mt-1"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Nama Lengkap</p>
                            <p className="text-gray-800">{userData.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Nomor Telepon</p>
                            <p className="text-gray-800">{userData.phoneNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Alamat</p>
                            <p className="text-gray-800">{userData.alamat}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800">{userData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Registrasi</p>
                        <p className="text-gray-800">{userData.registrationDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Stats */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Informasi Transaksi
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <ShoppingBag className="w-6 h-6 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">Total Transaksi</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {userData.stats.totalTransactions}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-500">Total Nominal</p>
                          <p className="text-lg font-semibold text-gray-800">
                            Rp {userData.stats.totalTransactionValue.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-6 h-6 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-500">Transaksi Terbesar</p>
                          <p className="text-lg font-semibold text-gray-800">
                            Rp {userData.stats.largestTransaction.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;