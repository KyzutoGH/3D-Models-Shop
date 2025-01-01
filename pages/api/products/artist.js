import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from '../../../lib/db';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public/uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

// Save uploaded file
async function saveFile(file, prefix) {
  const timestamp = Date.now();
  const originalName = file.originalFilename;
  const ext = path.extname(originalName);
  const filename = `${prefix}-${timestamp}${ext}`;
  const filepath = path.join(uploadDir, filename);
  
  await fs.copyFile(file.filepath, filepath);
  return `/uploads/${filename}`;
}

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'artist') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await ensureUploadDir();
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

    if (req.method === 'POST' || req.method === 'PUT') {
      const form = formidable({
        uploadDir: uploadDir,
        keepExtensions: true,
        maxFileSize: 100 * 1024 * 1024, // 100MB limit
      });

      const [fields, files] = await form.parse(req);
      
      // Handle file uploads
      const uploads = {};
      if (files.image?.[0]) {
        uploads.image = await saveFile(files.image[0], 'img');
      }
      if (files.model?.[0]) {
        uploads.model_path = await saveFile(files.model[0], 'model');
      }
      if (files.preview?.[0]) {
        uploads.preview_path = await saveFile(files.preview[0], 'preview');
      }

      const data = {
        name: fields.name?.[0],
        price: fields.price?.[0],
        description: fields.description?.[0],
        format: fields.format?.[0],
        polygon_count: fields.polygon_count?.[0],
        textures: fields.textures?.[0],
        rigged: fields.rigged?.[0],
        specifications: fields.specifications?.[0],
        artist_id: session.user.id,
        ...uploads
      };

      if (req.method === 'POST') {
        // Create SET clause from object keys
        const keys = Object.keys(data);
        const placeholders = keys.map(() => '?').join(', ');
        const setClause = keys.join(', ');
        
        const [result] = await connection.execute(
          `INSERT INTO product (${setClause}, createdAt) VALUES (${placeholders}, NOW())`,
          [...Object.values(data)]
        );
        return res.status(201).json({ id: result.insertId });
      } else {
        const { id } = req.query;
        // Get existing file paths before update
        const [existing] = await connection.execute(
          'SELECT image, model_path, preview_path FROM product WHERE id = ? AND artist_id = ?',
          [id, session.user.id]
        );

        if (existing.length === 0) {
          return res.status(404).json({ error: 'Product not found or unauthorized' });
        }

        // Delete old files if new ones are uploaded
        const oldFiles = existing[0];
        for (const [key, value] of Object.entries(uploads)) {
          if (oldFiles[key]) {
            const oldPath = path.join(process.cwd(), 'public', oldFiles[key].replace(/^\//, ''));
            try {
              await fs.unlink(oldPath);
            } catch (error) {
              console.error(`Failed to delete old file: ${oldPath}`, error);
            }
          }
        }

        // Create SET clause for update
        const updates = Object.entries(data)
          .map(([key]) => `${key} = ?`)
          .join(', ');

        const [result] = await connection.execute(
          `UPDATE product SET ${updates}, updatedAt = NOW() WHERE id = ? AND artist_id = ?`,
          [...Object.values(data), id, session.user.id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Product not found or unauthorized' });
        }

        return res.status(200).json({ message: 'Product updated successfully' });
      }
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      // Get file paths before deletion
      const [files] = await connection.execute(
        'SELECT image, model_path, preview_path FROM product WHERE id = ? AND artist_id = ?',
        [id, session.user.id]
      );

      if (files.length > 0) {
        const filePaths = [files[0].image, files[0].model_path, files[0].preview_path]
          .filter(Boolean)
          .map(filepath => path.join(process.cwd(), 'public', filepath.replace(/^\//, '')));

        // Delete the files
        for (const filepath of filePaths) {
          try {
            await fs.unlink(filepath);
          } catch (error) {
            console.error(`Failed to delete file: ${filepath}`, error);
          }
        }
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

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    if (connection) connection.release();
  }
};

export default handler;