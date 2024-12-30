import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { Download, Eye } from 'lucide-react';

export default function TransaksiPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/transaksi/list');
          if (response.ok) {
            const data = await response.json();
            setTransactions(data);
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [session]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleDownload = async (productId) => {
    try {
      window.location.href = `/api/download/${productId}`;
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Riwayat Transaksi | PunyaBapak</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Transaksi</h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <li key={transaction.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16">
                          <Image
                            src={`/img/${transaction.product_image}`}
                            alt={transaction.product_name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            Order #{transaction.id}
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {transaction.product_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(transaction.total_amount)}
                        </p>
                        <p className={`text-sm ${
                          transaction.status === 'completed' ? 'text-green-600' :
                          transaction.status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </p>
                      </div>
                    </div>

                    {transaction.status === 'completed' && (
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          onClick={() => handleDownload(transaction.product_id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => router.push(`/preview/${transaction.product_id}`)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Preview</span>
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
              {transactions.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-500">
                  Belum ada transaksi
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}