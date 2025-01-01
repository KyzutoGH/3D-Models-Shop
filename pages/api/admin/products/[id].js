export default async function handler(req, res) {
    const session = await getSession({ req });
  
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    const { id } = req.query;
  
    if (req.method === 'DELETE') {
      try {
        const connection = await pool.getConnection();
        
        await connection.execute(
          'DELETE FROM products WHERE id = ?',
          [id]
        );
  
        connection.release();
  
        return res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ error: 'Failed to delete product' });
      }
    }
  
    return res.status(405).json({ error: 'Method not allowed' });
  }