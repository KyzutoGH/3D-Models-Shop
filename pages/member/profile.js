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

  return {
    props: { session },
  };
}

const Profile = ({ session }) => {
  const router = useRouter();
  const user = session?.user || {};
  const [greeting, setGreeting] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: user.name || '',
    phoneNumber: user.hp || '',
    email: user.email || '',
    alamat: user.alamat || '',
    fullName: user.fullName || '',
    registrationDate: '',
    transactionStatus: user.totalTransactions || '0',
    totalNominalTransaction: user.totalTransactionValue || '0',
    totalTransaction: user.largestTransaction || '0',
    role: user.role || 'member'
  });
  const [editData, setEditData] = useState({...formData});

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
        const response = await fetch(`/api/users/${user.id}`, {
          timeout: 10000
        });

        if (!response.ok) throw new Error('Gagal mengambil data pengguna');

        const data = await response.json();
        if (data) {
          // Format the date using a safe date parsing method
          const registrationDate = data.registrationDate ? 
            new Date(data.registrationDate.replace(/-/g, '/')).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Belum tersedia';

          setFormData(prev => ({
            ...prev,
            fullName: data.fullName || prev.fullName,
            username: data.userName || prev.username,
            alamat: data.alamat || prev.alamat,
            registrationDate,
            transactionStatus: data.stats?.totalTransactions?.toString() || '0',
            totalNominalTransaction: data.stats?.totalTransactionValue || '0',
            totalTransaction: data.stats?.largestTransaction || '0',
            phoneNumber: data.phoneNumber || prev.phoneNumber,
            role: data.role || prev.role,
          }));
          
          // Also update the edit data
          setEditData(prev => ({
            ...prev,
            fullName: data.fullName || prev.fullName,
            username: data.userName || prev.username,
            email:data.email || prev.email,
            alamat: data.alamat || prev.alamat,
            phoneNumber: data.phoneNumber || prev.phoneNumber,
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user.id]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({...formData});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({...formData});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: editData.username,
          phoneNumber: editData.phoneNumber,
          alamat: editData.alamat,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      // Update both formData and editData with the new values
      setFormData(prev => ({
        ...prev,
        username: editData.username,
        phoneNumber: editData.phoneNumber,
        email: editData.email,
        alamat: editData.alamat,
      }));
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const onLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        await signOut({
          callbackUrl: '/login',
          redirect: true
        });
      }
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

  const renderEditableField = (label, icon, name, value, type = 'text') => {
    const Icon = icon;
    return (
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          {isEditing ? (
            <input
              type={type}
              name={name}
              value={editData[name]}
              onChange={handleInputChange}
              className="w-full p-1 border rounded text-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-500">{value || 'Belum diisi'}</p>
          )}
        </div>
      </div>
    );
  };

  const { Icon, color, bgColor } = getBadgeContent(formData.role);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {formData.fullName || 'User Profile'}
                </h1>
                <p className="text-gray-600">{greeting}, {formData.username}</p>
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
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                    <button
                      className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
                      aria-label="Update profile picture"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-800">
                    {formData.username}
                  </h2>
                  <p className="text-gray-600">{formData.email}</p>
                  <div className="mt-4 flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${bgColor}`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <span className="text-sm text-gray-600">
                      Anda adalah {formData.role || 'Pengguna'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Informasi Pribadi
                  </h2>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="flex items-center space-x-1 text-green-500 hover:text-green-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span className="text-sm">
                          {isSaving ? 'Saving...' : 'Save'}
                        </span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span className="text-sm">Cancel</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEditClick}
                      className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {renderEditableField('Username', User, 'username', formData.username)}
                    {renderEditableField('Nomor Telepon', Phone, 'phoneNumber', formData.phoneNumber)}
                    {renderEditableField('Email', Mail, 'email',  'email', formData.email)}
                  </div>
                  <div className="space-y-4">
                    {renderEditableField('Alamat', MapPin, 'alamat', formData.alamat)}
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Daftar</p>
                        <p className="text-gray-800">{formData.registrationDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Informasi Transaksi
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <ShoppingBag className="w-6 h-6 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Total Transaksi (Count)
                          </p>
                          <p className="text-lg font-semibold text-gray-800">
                            {formData.transactionStatus}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Nilai Total Transaksi (Rp)
                          </p>
                          <p className="text-lg font-semibold text-gray-800">
                            Rp {parseInt(formData.totalNominalTransaction).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-6 h-6 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Transaksi Terbesar (Rp)
                          </p>
                          <p className="text-lg font-semibold text-gray-800">
                            Rp {parseInt(formData.totalTransaction).toLocaleString('id-ID')}
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