// app/lib/data.js
export async function fetchProducts() {
    try {
      const response = await fetch('/api/products'); // Sesuaikan dengan endpoint API Anda
      if (!response.ok) {
        throw new Error('Gagal mengambil product');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }