import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from '../../../lib/db';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (session.user.role !== 'artist') {
    return res.status(403).json({ error: 'Forbidden - Artist access required' });
  }

  let connection;
  try {
    connection = await db.getConnection();

    switch (req.method) {
      case 'GET':
        const [products] = await connection.execute(
          'SELECT * FROM product WHERE artist_id = ? ORDER BY createdAt DESC',
          [session.user.id]
        );
        return res.status(200).json(products);

      case 'POST': {
        const { name, price, description, format, polygon_count, textures, rigged } = req.body;
        
        if (!name?.trim() || !price) {
          return res.status(400).json({ error: 'Name and price are required' });
        }

        const [result] = await connection.execute(
          `INSERT INTO product (name, price, description, format, polygon_count, textures, rigged, artist_id, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [name, price, description, format, polygon_count, textures, rigged, session.user.id]
        );

        return res.status(201).json({ id: result.insertId });
      }

      case 'DELETE': {
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ error: 'Product ID is required' });
        }

        const [result] = await connection.execute(
          'DELETE FROM product WHERE id = ? AND artist_id = ?',
          [id, session.user.id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Product not found or unauthorized' });
        }

        return res.status(200).json({ message: 'Product deleted successfully' });
      }

      case 'PUT': {
        const { id } = req.query;
        const { name, price, description, format, polygon_count, textures, rigged } = req.body;
        
        if (!id || !name?.trim() || !price) {
          return res.status(400).json({ error: 'Product ID, name, and price are required' });
        }

        const [result] = await connection.execute(
          `UPDATE product 
           SET name = ?, price = ?, description = ?, format = ?, 
               polygon_count = ?, textures = ?, rigged = ?
           WHERE id = ? AND artist_id = ?`,
          [name, price, description, format, polygon_count, textures, rigged, id, session.user.id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Product not found or unauthorized' });
        }

        return res.status(200).json({ message: 'Product updated successfully' });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  } finally {
    if (connection) await connection.release();
  }
}
