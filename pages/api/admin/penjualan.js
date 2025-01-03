// pages/api/admin/penjualan.js
import pool from '../../../lib/db';  // Perhatikan path import disesuaikan

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { period } = req.query;
  const connection = await pool.getConnection();
  
  try {
    let dateFilter = '';
    
    switch(period) {
      case 'today':
        dateFilter = "AND DATE(o.created_at) = CURDATE()";
        break;
      case 'week':
        dateFilter = "AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)";
        break;
      case 'month':
        dateFilter = "AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)";
        break;
      case 'year':
        dateFilter = "AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)";
        break;
      default:
        dateFilter = ''; // all time
    }

    // Get sales data with product and user details
    const [salesData] = await connection.query(`
      SELECT 
        o.id as orderId,
        o.created_at as date,
        o.status,
        o.total_amount as totalAmount,
        u.name as artistName,
        p.name as productName,
        od.quantity,
        od.price,
        (od.quantity * od.price) as subtotal
      FROM transaksi o
      JOIN detail_transaksi od ON o.id = od.transaksi_id
      JOIN users u ON o.user_id = u.id
      JOIN product p ON od.product_id = p.id
      WHERE o.status != 'cancelled'
      ${dateFilter}
      ORDER BY o.created_at DESC
    `);

    // Get revenue data grouped by date
    const [revenueData] = await connection.query(`
      SELECT 
        DATE(o.created_at) as date,
        SUM(od.quantity * od.price) as revenue
      FROM transaksi o
      JOIN detail_transaksi od ON o.id = od.transaksi_id
      WHERE o.status = 'completed'
      ${dateFilter}
      GROUP BY DATE(o.created_at)
      ORDER BY date
    `);

    // Get top performing artists
    const [artistsData] = await connection.query(`
      SELECT 
        u.name as artistName,
        COUNT(DISTINCT o.id) as totalOrders,
        SUM(od.quantity * od.price) as revenue
      FROM transaksi o
      JOIN detail_transaksi od ON o.id = od.transaksi_id
      JOIN users u ON o.user_id = u.id
      WHERE o.status = 'completed'
      ${dateFilter}
      GROUP BY u.id, u.name
      ORDER BY revenue DESC
      LIMIT 10
    `);

    const response = {
      sales: salesData.map(row => ({
        orderId: row.orderId,
        date: row.date,
        status: row.status,
        artistName: row.artistName,
        productName: row.productName,
        quantity: parseInt(row.quantity),
        price: parseFloat(row.price),
        total: parseFloat(row.subtotal)
      })),
      revenue: revenueData.map(row => ({
        date: row.date,
        revenue: parseFloat(row.revenue || 0)
      })),
      topArtists: artistsData.map(row => ({
        artistName: row.artistName,
        sales: parseInt(row.totalOrders),
        revenue: parseFloat(row.revenue || 0)
      })),
      totalRevenue: parseFloat(salesData.reduce((sum, row) => sum + row.subtotal, 0))
    };

    // Debug log
    console.log('API Response:', {
      salesCount: salesData.length,
      revenueDataCount: revenueData.length,
      artistsCount: artistsData.length
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  } finally {
    connection.release();
  }
}