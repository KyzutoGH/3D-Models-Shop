import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from '../../../lib/db';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'artist') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let connection;
  try {
    connection = await db.getConnection();

    if (req.method === 'GET') {
      const [products] = await connection.execute(
        'SELECT * FROM product WHERE artist_id = ? ORDER BY createdAt DESC',
        [session.user.id]
      );
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const { name, price, description, format, polygon_count, textures, rigged } = req.body;
      
      const [result] = await connection.execute(
        `INSERT INTO product (name, price, description, format, polygon_count, textures, rigged, artist_id, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [name, price, description, format, polygon_count, textures, rigged, session.user.id]
      );

      return res.status(201).json({ id: result.insertId });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      const [result] = await connection.execute(
        'DELETE FROM product WHERE id = ? AND artist_id = ?',
        [id, session.user.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found or unauthorized' });
      }

      return res.status(200).json({ message: 'Product deleted successfully' });
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, price, description, format, polygon_count, textures, rigged } = req.body;
      
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

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (connection) connection.release();
  }
}