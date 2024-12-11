import React from 'react';

export default function Home() {
  return (
    <div>
      <header className="bg-blue-700 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.svg" alt="PunyaBapak Store" className="h-8 mr-4" />
            <h1 className="text-2xl font-bold">PunyaBapak Store</h1>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Cari produk"
              className="px-4 py-2 rounded-md border-2 border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent mr-4"
            />
            <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md">
              Masuk
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Selamat Datang di PunyaBapak Store</h2>
        <p className="mb-8 text-gray-600">Jelajahi produk-produk menarik kami!</p>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-blue-700 text-white p-4 rounded-md hover:bg-blue-800 transition-colors duration-300">
            <img src="/product1.jpg" alt="Barang 1" className="mb-4 rounded-md" />
            <h3 className="text-lg font-medium mb-2">Barang 1</h3>
            <p className="text-gray-200">Deskripsi singkat produk 1</p>
            <div className="mt-4">
              <span className="text-green-500 font-medium">Rp 50.000</span>
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md float-right">
                Beli
              </button>
            </div>
          </div>
          <div className="bg-blue-700 text-white p-4 rounded-md hover:bg-blue-800 transition-colors duration-300">
            <img src="/product2.jpg" alt="Barang 2" className="mb-4 rounded-md" />
            <h3 className="text-lg font-medium mb-2">Barang 2</h3>
            <p className="text-gray-200">Deskripsi singkat produk 2</p>
            <div className="mt-4">
              <span className="text-green-500 font-medium">Rp 75.000</span>
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md float-right">
                Beli
              </button>
            </div>
          </div>
          <div className="bg-blue-700 text-white p-4 rounded-md hover:bg-blue-800 transition-colors duration-300">
            <img src="/product3.jpg" alt="Barang 3" className="mb-4 rounded-md" />
            <h3 className="text-lg font-medium mb-2">Barang 3</h3>
            <p className="text-gray-200">Deskripsi singkat produk 3</p>
            <div className="mt-4">
              <span className="text-green-500 font-medium">Rp 100.000</span>
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md float-right">
                Beli
              </button>
            </div>
          </div>
          <div className="bg-blue-700 text-white p-4 rounded-md hover:bg-blue-800 transition-colors duration-300">
            <img src="/product4.jpg" alt="Barang 4" className="mb-4 rounded-md" />
            <h3 className="text-lg font-medium mb-2">Barang 4</h3>
            <p className="text-gray-200">Deskripsi singkat produk 4</p>
            <div className="mt-4">
              <span className="text-green-500 font-medium">Rp 125.000</span>
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md float-right">
                Beli
              </button>
            </div>
          </div>
          <div className="bg-blue-700 text-white p-4 rounded-md hover:bg-blue-800 transition-colors duration-300">
            <img src="/product5.jpg" alt="Barang 5" className="mb-4 rounded-md" />
            <h3 className="text-lg font-medium mb-2">Barang 5</h3>
            <p className="text-gray-200">Deskripsi singkat produk 5</p>
            <div className="mt-4">
              <span className="text-green-500 font-medium">Rp 150.000</span>
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md float-right">
                Beli
              </button>
            </div>
          </div>
          <div className="bg-blue-700 text-white p-4 rounded-md hover:bg-blue-800 transition-colors duration-300">
            <img src="/product6.jpg" alt="Barang 6" className="mb-4 rounded-md" />
            <h3 className="text-lg font-medium mb-2">Barang 6</h3>
            <p className="text-gray-200">Deskripsi singkat produk 6</p>
            <div className="mt-4">
              <span className="text-green-500 font-medium">Rp 175.000</span>
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md float-right">
                Beli
              </button>
            </div>
          </div>
          <div className="bg-blue-700 text-white p-4 rounded-md hover:bg-blue-800 transition-colors duration-300">
            <img src="/product7.jpg" alt="Barang 7" className="mb-4 rounded-md" />
            <h3 className="text-lg font-medium mb-2">Barang 7</h3>
            <p className="text-gray-200">Deskripsi singkat produk 7</p>
            <div className="mt-4">
              <span className="text-green-500 font-medium">Rp 200.000</span>
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md float-right">
                Beli
              </button>
            </div>
          </div>
          <div className="bg-blue-700 text-white p-4 rounded-md hover:bg-blue-800 transition-colors duration-300">
            <img src="/product8.jpg" alt="Barang 8" className="mb-4 rounded-md" />
            <h3 className="text-lg font-medium mb-2">Barang 8</h3>
            <p className="text-gray-200">Deskripsi singkat produk 8</p>
            <div className="mt-4">
              <span className="text-green-500 font-medium">Rp 225.000</span>
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md float-right">
                Beli
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}