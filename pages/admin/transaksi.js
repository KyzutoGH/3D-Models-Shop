import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const SalesAnalyticsPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/sales?period=${selectedPeriod}`);
        if (response.ok) {
          const data = await response.json();
          setSalesData(data.sales);
          setTotalRevenue(data.totalRevenue);
          setTopArtists(data.topArtists);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedPeriod]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Period Filter */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Sales History</h2>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8884d8" 
                        name="Revenue"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Artists Card */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Artists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topArtists}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="artistName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="sales" 
                        fill="#82ca9d" 
                        name="Total Sales"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Sales Table */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Sales Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border">Order ID</th>
                        <th className="py-2 px-4 border">Date</th>
                        <th className="py-2 px-4 border">Artist</th>
                        <th className="py-2 px-4 border">Product</th>
                        <th className="py-2 px-4 border">Quantity</th>
                        <th className="py-2 px-4 border">Price</th>
                        <th className="py-2 px-4 border">Total</th>
                        <th className="py-2 px-4 border">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.map((sale) => (
                        <tr key={sale.orderId} className="text-gray-700">
                          <td className="py-2 px-4 border">{sale.orderId}</td>
                          <td className="py-2 px-4 border">{new Date(sale.date).toLocaleDateString()}</td>
                          <td className="py-2 px-4 border">{sale.artistName}</td>
                          <td className="py-2 px-4 border">{sale.productName}</td>
                          <td className="py-2 px-4 border text-center">{sale.quantity}</td>
                          <td className="py-2 px-4 border text-right">
                            {new Intl.NumberFormat('id-ID', { 
                              style: 'currency', 
                              currency: 'IDR' 
                            }).format(sale.price)}
                          </td>
                          <td className="py-2 px-4 border text-right">
                            {new Intl.NumberFormat('id-ID', { 
                              style: 'currency', 
                              currency: 'IDR' 
                            }).format(sale.price * sale.quantity)}
                          </td>
                          <td className="py-2 px-4 border">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                              sale.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {sale.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="6" className="py-2 px-4 border text-right font-semibold">
                          Total Revenue:
                        </td>
                        <td colSpan="2" className="py-2 px-4 border text-right font-semibold">
                          {new Intl.NumberFormat('id-ID', { 
                            style: 'currency', 
                            currency: 'IDR' 
                          }).format(totalRevenue)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SalesAnalyticsPage;