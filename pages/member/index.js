import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Search, User, Menu, ArrowRight, LogOut, Star } from 'lucide-react';
import { getSession, signOut } from 'next-auth/react';

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

  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = context.req.headers.host;
    const apiUrl = `${protocol}://${host}/api/products`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const products = await response.json();

    if (!Array.isArray(products)) {
      throw new Error('Invalid products data structure');
    }

    return {
      props: {
        session,
        products,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        session,
        products: [],
        error: {
          message: error.message,
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        }
      },
    };
  }
}

const HomePageMember = ({ session, products }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
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
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.artist_name && product.artist_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

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
    router.push('/member/profile');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <Head>
        <title>Home | PunyaBapak</title>
        <meta name="description" content="Welcome to PunyaBapak Store" />
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
                    fill
                    className="rounded-lg object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-gray-800">PunyaBapak</span>
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-2xl mx-6">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Cari produk atau artist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* User Navigation */}
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{greeting},</p>
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
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
                <div className="space-y-4">
                  <div className="px-4">
                    <p className="text-sm text-gray-600">{greeting},</p>
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={navigateToProfile}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Search */}
            <div className="md:hidden py-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari produk atau artist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Selamat Datang di PunyaBapak
            </h1>
            <p className="text-gray-600 text-lg">
              Temukan berbagai produk berkualitas untuk kebutuhan Anda
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/member/product/${product.id}`)}
              >
                <div className="relative h-48">
                  <Image
                    src={product.image.startsWith('/') ? product.image : `/${product.image}`}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>

                  {/* Artist Info */}
                  {product.artist_name && (
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {product.artist_name}
                      </span>
                    </div>
                  )}

                  {/* Rating & Stats */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {product.average_rating ?
                          Number(product.average_rating).toFixed(1) :
                          '0.0'
                        }
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">|</span>
                    <span className="text-sm text-gray-600">
                      {product.units_sold || 0} Terjual
                    </span>
                  </div>

                  <p className="text-blue-500 font-bold mb-4">
                    {formatPrice(product.price)}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/member/product/${product.id}`);
                    }}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Lihat Detail</span>
                  </button>
                </div>
              </div>
            ))}
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

export default HomePageMember;