import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

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
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    format: '',
    polygon_count: '',
    textures: '',
    rigged: ''
  });

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role !== 'artist') {
        router.replace('/');
      } else {
        fetchProducts();
      }
    }
  }, [session, status, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products/artist');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch products');
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
      rigged: product.rigged || ''
    });
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
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name?.trim() || !formData.price) {
      alert('Name and price are required');
      return;
    }

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = `/api/products/artist${editingProduct ? `?id=${editingProduct.id}` : ''}`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save product');
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: '', 
        price: '', 
        description: '', 
        format: '',
        polygon_count: '', 
        textures: '', 
        rigged: ''
      });
      fetchProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== 'artist') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola 3D Model</h1>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              price: '',
              description: '',
              format: '',
              polygon_count: '',
              textures: '',
              rigged: ''
            });
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tambah Model
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg shadow-sm overflow-hidden">
            <img 
              src={product.image || '/placeholder.png'} 
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg truncate">{product.name}</h3>
              <p className="text-blue-500 font-bold my-2">Rp {product.price}</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Format: {product.format}</p>
                <p>Polygon: {product.polygon_count}</p>
                <p>Textures: {product.textures}</p>
                <p>Rigged: {product.rigged}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Model' : 'Tambah Model Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Nama Model</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Format File</label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) => setFormData({...formData, format: e.target.value})}
                    className="w-full border rounded p-2"
                    placeholder="FBX, OBJ, GLB"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Polygon Count</label>
                  <input
                    type="text"
                    value={formData.polygon_count}
                    onChange={(e) => setFormData({...formData, polygon_count: e.target.value})}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Textures</label>
                <input
                  type="text"
                  value={formData.textures}
                  onChange={(e) => setFormData({...formData, textures: e.target.value})}
                  className="w-full border rounded p-2"
                  placeholder="PBR Textures"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Rigged</label>
                <input
                  type="text"
                  value={formData.rigged}
                  onChange={(e) => setFormData({...formData, rigged: e.target.value})}
                  className="w-full border rounded p-2"
                  placeholder="Full Body Rig"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded p-2"
                  rows="4"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (session.user.role !== 'artist') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Ensure all potentially undefined values are set to null for serialization
  const serializedSession = {
    ...session,
    user: {
      ...session.user,
      image: session.user.image || null,
    },
  };

  return {
    props: { 
      session: serializedSession
    }
  };
}