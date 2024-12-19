// pages/api/products.js
import { prisma } from '@/lib/prisma'; // Sesuaikan dengan setup database Anda

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
        }
      });
      
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'gagal mengambil product' });
    }
  }
}