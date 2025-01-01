// pages/admin/produk.js
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const ProdukPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/error401");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...'); // Debug log
        const response = await fetch('/api/admin/products');
        console.log('Response status:', response.status); // Debug log
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data:', data); // Debug log
          setProducts(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Nama Produk</th>
                    <th className="py-2 px-4 border">Artist</th>
                    <th className="py-2 px-4 border">Harga</th>
                    <th className="py-2 px-4 border">Deskripsi</th>
                    <th className="py-2 px-4 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-4 text-center text-gray-500">
                        Tidak ada produk yang tersedia
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td className="py-2 px-4 border">{product.id}</td>
                        <td className="py-2 px-4 border">{product.name}</td>
                        <td className="py-2 px-4 border">{product.artist_name}</td>
                        <td className="py-2 px-4 border">
                          Rp {product.harga?.toLocaleString('id-ID') || 0}
                        </td>
                        <td className="py-2 px-4 border">
                          <div className="max-w-xs truncate">
                            {product.description}
                          </div>
                        </td>
                        <td className="py-2 px-4 border">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdukPage;