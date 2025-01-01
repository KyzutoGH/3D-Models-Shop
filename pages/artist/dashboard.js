import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Upload, X, Package, DollarSign, TrendingUp, ShoppingBag, Search, Filter, Plus } from 'lucide-react';

export default function ArtistDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState({
    image: null,
    model: null,
    preview: null
  });
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    format: '',
    polygon_count: '',
    textures: '',
    rigged: '',
    specifications: ''
  });

  const stats = [
    {
      label: 'Total Produk',
      value: products.length,
      icon: <Package className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Pendapatan',
      value: 'Rp 0',
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      bgColor: 'bg-green-50'
    },
    {
      label: 'Produk Terjual',
      value: '0',
      icon: <ShoppingBag className="w-6 h-6 text-purple-500" />,
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Produk Terlaris',
      value: '-',
      icon: <TrendingUp className="w-6 h-6 text-orange-500" />,
      bgColor: 'bg-orange-50'
    }
  ];

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'artist') {
      fetchProducts();
    }
  }, [session, status]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products/artist');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      if (type === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    if (files.image) formDataToSend.append('image', files.image);
    if (files.model) formDataToSend.append('model', files.model);
    if (files.preview) formDataToSend.append('preview', files.preview);

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = `/api/products/artist${editingProduct ? `?id=${editingProduct.id}` : ''}`;

      const res = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (!res.ok) throw new Error('Failed to save product');

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      format: product.format || '',
      polygon_count: product.polygon_count || '',
      textures: product.textures || '',
      rigged: product.rigged || '',
      specifications: product.specifications || ''
    });
    setPreviewImage(product.image);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah anda yakin ingin menghapus produk ini?')) return;
    
    try {
      const res = await fetch(`/api/products/artist?id=${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete product');
      }

      fetchProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      format: '',
      polygon_count: '',
      textures: '',
      rigged: '',
      specifications: ''
    });
    setFiles({
      image: null,
      model: null,
      preview: null
    });
    setPreviewImage(null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Top Navigation */}
      <div className="bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold">Artist Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={session?.user?.image || '/placeholder-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{session?.user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-900 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Management Section */}
        <div className="bg-gray-900 rounded-lg shadow">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Daftar Produk</h2>
              <button 
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Produk
              </button>
            </div>
            
            {/* Search and Filter */}
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button className="flex items-center px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48">
                    <img 
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.preview_path && (
                      <button
                        onClick={() => router.push(`/preview/${product.id}`)}
                        className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        Preview 3D
                      </button>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium truncate flex-1">{product.name}</h3>
                    </div>
                    <p className="text-lg font-bold text-blue-400 mb-2">
                      Rp {parseInt(product.price).toLocaleString()}
                    </p>
                    <div className="space-y-1 text-sm text-gray-300 mb-4">
                      <p><span className="font-medium">Format:</span> {product.format}</p>
                      <p><span className="font-medium">Polygon:</span> {product.polygon_count}</p>
                      <p><span className="font-medium">Textures:</span> {product.textures}</p>
                      <p><span className="font-medium">Rigged:</span> {product.rigged}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-transparent border border-blue-500 text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 bg-transparent border border-red-500 text-red-400 px-3 py-2 rounded-lg hover:bg-red-900 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Edit Model' : 'Tambah Model Baru'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Nama Model*</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Harga (Rp)*</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block mb-1">Preview Image*</label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                    {previewImage ? (
                      <div className="relative">
                        <img src={previewImage} alt="Preview" className="max-h-32 mx-auto" />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setFiles(prev => ({ ...prev, image: null }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <label className="cursor-pointer text-blue-400 hover:text-blue-300">
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'image')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2 space-y-4">
                  <div>
                    <label className="block mb-1">3D Model File*</label>
                    <input
                      type="file"
                      accept=".glb,.gltf,.fbx,.obj"
                      onChange={(e) => handleFileChange(e, 'model')}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Preview Model (optional)</label>
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      onChange={(e) => handleFileChange(e, 'preview')}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Other form fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Format File*</label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) => setFormData({...formData, format: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="FBX, OBJ, GLB"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Polygon Count*</label>
                  <input
                    type="text"
                    value={formData.polygon_count}
                    onChange={(e) => setFormData({...formData, polygon_count: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Textures*</label>
                  <input
                    type="text"
                    value={formData.textures}
                    onChange={(e) => setFormData({...formData, textures: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Rigged*</label>
                  <input
                    type="text"
                    value={formData.rigged}
                    onChange={(e) => setFormData({...formData, rigged: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Deskripsi*</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Spesifikasi Tambahan</label>
                <textarea
                  value={formData.specifications}
                  onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Tambahan informasi teknis atau persyaratan khusus"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingProduct ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}