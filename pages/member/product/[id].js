import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { Search, User, Menu, Eye, Plus, Minus, LogOut, Share2, Heart, Shield, 
         Package, FileCheck, ArrowLeft, ShoppingCart, Download } from 'lucide-react';

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

const ProductDetailPage = ({ session }) => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const user = session?.user || {};

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      let greetingMessage = '';
      if (currentHour >= 5 && currentHour < 10) greetingMessage = 'Selamat Pagi';
      else if (currentHour >= 10 && currentHour < 15) greetingMessage = 'Selamat Siang';
      else if (currentHour >= 15 && currentHour < 18) greetingMessage = 'Selamat Sore';
      else greetingMessage = 'Selamat Malam';
      setGreeting(greetingMessage);
    };

    updateGreeting();

    const fetchProduct = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await fetch(`/api/products/${id}`);

          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }

          const productData = await response.json();
          setProduct(productData);
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id]);

  const handleLogout = async () => {
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

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const handleQuantityChange = (increment) => {
    setQuantity(prev => {
      const newValue = prev + increment;
      return newValue;
    });
  };

  const handleCheckout = async () => {
    // Your checkout logic here using Midtrans
    router.push(`/transaksi/${id}?quantity=${quantity}`);
  };

  const handleDownload = async () => {
    try {
      window.location.href = `/api/download/${id}`;
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.product_name} | PunyaBapak</title>
        <meta name="description" content={product.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 relative">
                  <Image
                    src="/IconShopBlk.png"
                    alt="PunyaBapak Logo"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
                <span className="text-xl font-bold text-gray-800">PunyaBapak</span>
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-2xl mx-6">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* User Navigation */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{greeting},</p>
                      <p className="text-sm font-semibold text-gray-800">{user.fullName || user.name}</p>
                    </div>
                    <button
                      onClick={navigateToProfile}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => router.push('/login')}
                    className="hidden md:flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Masuk</span>
                  </button>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden"
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden py-4 border-t">
                {user ? (
                  <div className="space-y-4">
                    <div className="px-4">
                      <p className="text-sm text-gray-600">{greeting},</p>
                      <p className="text-sm font-semibold text-gray-800">{user.fullName || user.name}</p>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={navigateToProfile}
                        className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/member')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        {/* Product Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={`/img/${product.image}`}
                    alt={product.product_name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.product_name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">
                        {new Intl.NumberFormat('en-US', { 
                          minimumFractionDigits: 1, 
                          maximumFractionDigits: 1 
                        }).format(product.average_rating)}
                      </span>
                    </div>
                    <span>|</span>
                    <span>{product.total_reviews} Reviews</span>
                    <span>|</span>
                    <span>{product.units_sold} Terjual</span>
                  </div>
                </div>

                <div className="border-t border-b py-4">
                  <p className="text-3xl font-bold text-blue-500">{formatPrice(product.price)}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Format File:</span>
                    <span className="text-gray-800">
                      {Array.isArray(product.format)
                        ? product.format.join(', ')
                        : product.format || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Polygon Count:</span>
                    <span className="text-gray-800">{product.polygon_count}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Textures:</span>
                    <span className="text-gray-800">{product.textures}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Rigged:</span>
                    <span className="text-gray-800">{product.rigged}</span>
                  </div>
                </div>

                {!product.has_purchased && (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-1 rounded-full border hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-1 rounded-full border hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  {product.has_purchased ? (
                    <>
                      <button 
                        onClick={handleDownload}
                        className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download File</span>
                      </button>
                      <button 
                        onClick={() => router.push(`/preview/${id}`)}
                        className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-5 h-5" />
                        <span>Preview</span>
                      </button></>
                  ) : (
                    <>
                      <button 
                        className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-5 h-5" />
                        <span>Preview</span>
                      </button>
                      <button 
                        onClick={handleCheckout}
                        className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Buy Now</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="border-t">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Product Description</h2>
                <p className="text-gray-600 mb-6">{product.description}</p>

                <h2 className="text-xl font-bold text-gray-800 mb-4">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications && typeof product.specifications === 'object' ? (
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex border-b py-2">
                        <span className="text-gray-600 w-1/2">{key}:</span>
                        <span className="text-gray-800 w-1/2">{value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-gray-600">No specifications available</div>
                  )}
                </div>

                {/* Product Features */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Shield className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Guaranteed Quality</h3>
                      <p className="text-sm text-gray-600">100% Quality Checked</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <Package className="w-8 h-8 text-green-500" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Instant Delivery</h3>
                      <p className="text-sm text-gray-600">Digital Download</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                    <FileCheck className="w-8 h-8 text-purple-500" />
                    <div>
                      <h3 className="font-semibold text-gray-800">License Included</h3>
                      <p className="text-sm text-gray-600">Commercial Use Ready</p>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-4xl font-bold text-gray-800">
                      {new Intl.NumberFormat('en-US', { 
                        minimumFractionDigits: 1, 
                        maximumFractionDigits: 1 
                      }).format(product.average_rating)}
                    </div>
                    <div>
                      <div className="flex text-yellow-400 mb-1">
                        {'★'.repeat(Math.floor(product.average_rating))}
                        {'☆'.repeat(5 - Math.floor(product.average_rating))}
                      </div>
                      <p className="text-sm text-gray-600">{product.total_reviews} total reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center text-gray-600">
              <p>© 2024 PunyaBapak. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ProductDetailPage;