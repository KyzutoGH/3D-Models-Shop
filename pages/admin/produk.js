import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layout/AdminLayout';
import { Eye, Trash2, X } from 'lucide-react';

const ProductsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/error401");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak bisa dibatalkan.')) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProducts(products.filter(product => product.id !== productId));
          alert('Produk berhasil dihapus');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Gagal menghapus produk');
      }
    }
  };

  const Modal = ({ product, onClose }) => {
    if (!product) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
            <h3 className="text-xl font-semibold">Detail Produk</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Gambar Produk */}
              <div className="col-span-2 space-y-4">
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Preview Path jika ada */}
                {product.preview_path && (
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={product.preview_path}
                      alt={`Preview ${product.name}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                {/* Model Path jika ada */}
                {product.model_path && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">File Model 3D</p>
                    <p className="font-medium truncate">{product.model_path}</p>
                  </div>
                )}
              </div>
  
              {/* Informasi Dasar */}
              <div className="col-span-2">
                <h4 className="text-lg font-semibold mb-4">Informasi Dasar</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Produk</p>
                    <p className="font-medium">{product.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Harga</p>
                    <p className="font-medium">Rp {parseInt(product.price).toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Artist</p>
                    <p className="font-medium">{product.artist_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Upload</p>
                    <p className="font-medium">
                      {new Date(product.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Detail Teknis */}
              <div className="col-span-2">
                <h4 className="text-lg font-semibold mb-4">Detail Teknis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Format File</p>
                    <p className="font-medium">{product.format || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jumlah Polygon</p>
                    <p className="font-medium">{product.polygon_count || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tekstur</p>
                    <p className="font-medium">{product.textures || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rigged</p>
                    <p className="font-medium">{product.rigged || '-'}</p>
                  </div>
                </div>
              </div>
  
              {/* Deskripsi */}
              <div className="col-span-2">
                <h4 className="text-lg font-semibold mb-2">Deskripsi</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{product.description || '-'}</p>
              </div>
  
              {/* Spesifikasi */}
              <div className="col-span-2">
                <h4 className="text-lg font-semibold mb-2">Spesifikasi</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{product.specifications || '-'}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 sticky bottom-0">
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

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
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Manajemen Produk</h2>
            <div className="text-sm text-gray-600">
              Total Produk: {products.length}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Upload</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Rp {parseInt(product.price).toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.artist_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.format}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(product.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(product)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Lihat Detail"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal
          product={selectedProduct}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default ProductsPage;