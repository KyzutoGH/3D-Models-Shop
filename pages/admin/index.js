import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layout/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Paintbrush, ShoppingCart, Package, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    newMembers: 0,
    newArtists: 0,
    totalTransactions: 0,
    newProducts: 0,
    revenue: 0,
    popularProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/error401");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Replace with your actual API endpoints
        const [members, artists, transactions, products] = await Promise.all([
          fetch('/api/admin/statistik/member').then(res => res.json()),
          fetch('/api/admin/statistik/artist').then(res => res.json()),
          fetch('/api/admin/statistik/transaksi').then(res => res.json()),
          fetch('/api/admin/statistik/produk').then(res => res.json())
        ]);

        setStats({
          newMembers: members.count,
          newArtists: artists.count,
          totalTransactions: transactions.count,
          revenue: transactions.total,
          newProducts: products.count,
          popularProducts: products.popular || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Member Baru di Bulan Ini"
            value={stats.newMembers}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Artist Baru di Bulan Ini"
            value={stats.newArtists}
            icon={Paintbrush}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Transaksi"
            value={stats.totalTransactions}
            icon={ShoppingCart}
            color="bg-green-500"
          />
          <StatCard
            title="Produk Baru"
            value={stats.newProducts}
            icon={Package}
            color="bg-yellow-500"
          />
          <StatCard
            title="Keuntungan Bulan Ini"
            value={`Rp. ${stats.revenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-red-500"
          />
          <StatCard
            title="Growth Rate"
            value="↑ 12.5%"
            icon={TrendingUp}
            color="bg-indigo-500"
          />
        </div>

        {/* Popular Products Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Produk Populer</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.popularProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;