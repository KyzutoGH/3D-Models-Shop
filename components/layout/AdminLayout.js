import React from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, Users, ShoppingBag, BarChart3, LogOut } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Fungsi untuk mendapatkan sapaan berdasarkan waktu
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 3 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: router.pathname === '/admin'
    },
    {
      name: 'Manajemen Artist',
      href: '/admin/artist',
      icon: Users,
      current: router.pathname === '/admin/artist'
    },
    {
      name: 'Manajemen Member',
      href: '/admin/users',
      icon: Users,
      current: router.pathname === '/admin/users'
    },
    {
      name: 'Produk',
      href: '/admin/produk',
      icon: ShoppingBag,
      current: router.pathname === '/admin/produk'
    },
    {
      name: 'Transaksi',
      href: '/admin/transaksi',
      icon: BarChart3,
      current: router.pathname === '/admin/transaksi'
    }
  ];

  const onLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/login',
        redirect: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="mt-2 text-sm">
            <p className="text-gray-600">{getGreeting()},</p>
            <p className="font-medium text-blue-600">{session?.user?.name || session?.user?.email}</p>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center p-2 rounded-md transition-colors ${
                    item.current
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={onLogout}
            className="w-full flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Log out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;