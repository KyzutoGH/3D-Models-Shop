import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from '../../../lib/db';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { convertFBXtoGLB, isFBXFile, fileExists } from '../../../lib/modelConverter';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
      multiples: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const generateFileNames = (artistId, productId, originalFileName, type = '') => {
  const timestamp = Date.now();
  const ext = type || path.extname(originalFileName);
  return {
    model: `model_${artistId}_${productId}_${timestamp}${ext}`,
    preview: `preview_${artistId}_${productId}_${timestamp}.glb`, // Always GLB for preview
    image: `image_${artistId}_${productId}_${timestamp}${ext}`
  };
};

const moveFile = async (file, newPath) => {
  try {
    const fullPath = path.join(process.cwd(), 'public/uploads', newPath);
    await fs.rename(file.filepath, fullPath);
    return `/uploads/${newPath}`;
  } catch (error) {
    console.error('Error moving file:', error);
    throw error;
  }
};

const ensureUploadsDirectory = async () => {
  const uploadsPath = path.join(process.cwd(), 'public/uploads');
  try {
    await fs.access(uploadsPath);
  } catch {
    await fs.mkdir(uploadsPath, { recursive: true });
  }
};

const cleanupFiles = async (files) => {
  for (const file of files) {
    try {
      if (await fileExists(file)) {
        await fs.unlink(file);
      }
    } catch (error) {
      console.error('Error cleaning up file:', error);
    }
  }
};

const handleModelUpload = async (modelFile, artistId, productId) => {
  const fileNames = generateFileNames(artistId, productId, modelFile.originalFilename);
  
  // Move model file
  const modelPath = await moveFile(modelFile, fileNames.model);
  let previewPath = modelPath;

  // Convert FBX to GLB if needed
  if (isFBXFile(modelFile.originalFilename)) {
    const glbOutputPath = path.join(process.cwd(), 'public/uploads', fileNames.preview);
    const fbxInputPath = path.join(process.cwd(), 'public', modelPath);
    
    try {
      await convertFBXtoGLB(fbxInputPath, glbOutputPath);
      previewPath = `/uploads/${fileNames.preview}`;
      console.log('Successfully converted FBX to GLB:', previewPath);
    } catch (error) {
      console.error('Error converting FBX to GLB:', error);
      // Fallback to original model path
      previewPath = modelPath;
    }
  }

  return { modelPath, previewPath };
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  let connection;
  try {
    await ensureUploadsDirectory();
    connection = await db.getConnection();

    switch (req.method) {
      case 'GET': {
        const { id } = req.query;
        
        const [products] = await connection.execute(
          `SELECT * FROM product WHERE id = ?`,
          [id]
        );

        if (!products.length) {
          return res.status(404).json({ error: 'Product not found' });
        }

        const product = products[0];

        // Ensure paths exist
        const filesToCheck = [
          product.model_path && path.join(process.cwd(), 'public', product.model_path),
          product.preview_path && path.join(process.cwd(), 'public', product.preview_path)
        ].filter(Boolean);

        const fileCheckResults = await Promise.all(
          filesToCheck.map(file => fileExists(file))
        );

        if (fileCheckResults.some(exists => !exists)) {
          return res.status(400).json({ 
            error: 'Model files are missing',
            message: 'One or more model files are not accessible.'
          });
        }

        // Ensure paths start with /uploads/
        if (product.model_path && !product.model_path.startsWith('/uploads/')) {
          product.model_path = `/uploads/${product.model_path}`;
        }
        if (product.preview_path && !product.preview_path.startsWith('/uploads/')) {
          product.preview_path = `/uploads/${product.preview_path}`;
        }
        if (product.image && !product.image.startsWith('/uploads/')) {
          product.image = `/uploads/${product.image}`;
        }

        return res.status(200).json(product);
      }

      case 'POST': {
        if (session.user.role !== 'artist') {
          return res.status(403).json({ error: 'Forbidden - Artist access required' });
        }

        const { fields, files } = await parseForm(req);
        const { 
          name, price, description, format, 
          polygon_count, textures, rigged, specifications 
        } = fields;
        
        if (!name?.trim() || !price || !files.model) {
          return res.status(400).json({ error: 'Name, price, and model file are required' });
        }

        // Insert initial product to get ID
        const [result] = await connection.execute(
          `INSERT INTO product (
            name, price, artist_id, description, format,
            polygon_count, textures, rigged, specifications,
            createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            name, price, session.user.id, description || null, format || null,
            polygon_count || null, textures || null, rigged || null, specifications || null
          ]
        );

        const productId = result.insertId;

        // Handle model file and conversion
        const { modelPath, previewPath } = await handleModelUpload(
          files.model, 
          session.user.id, 
          productId
        );

        // Handle optional image file
        let imagePath = null;
        if (files.image) {
          const fileNames = generateFileNames(session.user.id, productId, files.image.originalFilename);
          imagePath = await moveFile(files.image, fileNames.image);
        }

        // Update product with file paths
        await connection.execute(
          `UPDATE product 
           SET model_path = ?, preview_path = ?, image = ?, updatedAt = NOW()
           WHERE id = ?`,
          [modelPath, previewPath, imagePath, productId]
        );

        return res.status(201).json({ 
          id: productId,
          model_path: modelPath,
          preview_path: previewPath,
          image: imagePath
        });
      }

      case 'PUT': {
        if (session.user.role !== 'artist') {
          return res.status(403).json({ error: 'Forbidden - Artist access required' });
        }

        const { fields, files } = await parseForm(req);
        const { id } = req.query;
        const { 
          name, price, description, format,
          polygon_count, textures, rigged, specifications 
        } = fields;
        
        if (!id || !name?.trim() || !price) {
          return res.status(400).json({ error: 'Product ID, name, and price are required' });
        }

        // Get current product data
        const [currentProduct] = await connection.execute(
          'SELECT model_path, preview_path, image FROM product WHERE id = ? AND artist_id = ?',
          [id, session.user.id]
        );

        if (!currentProduct.length) {
          return res.status(404).json({ error: 'Product not found or unauthorized' });
        }

        let updateFields = [
          name, price, description || null, format || null,
          polygon_count || null, textures || null, rigged || null,
          specifications || null
        ];
        
        let query = `UPDATE product 
                     SET name = ?, price = ?, description = ?, 
                         format = ?, polygon_count = ?, textures = ?, 
                         rigged = ?, specifications = ?, updatedAt = NOW()`;

        // Handle file updates
        if (files.model) {
          // Delete old files
          await cleanupFiles([
            path.join(process.cwd(), 'public', currentProduct[0].model_path),
            path.join(process.cwd(), 'public', currentProduct[0].preview_path)
          ]);

          // Handle new model file and conversion
          const { modelPath, previewPath } = await handleModelUpload(
            files.model, 
            session.user.id, 
            id
          );

          query += `, model_path = ?, preview_path = ?`;
          updateFields.push(modelPath, previewPath);
        }

        if (files.image) {
          // Delete old image
          if (currentProduct[0].image) {
            await cleanupFiles([path.join(process.cwd(), 'public', currentProduct[0].image)]);
          }

          const fileNames = generateFileNames(session.user.id, id, files.image.originalFilename);
          const imagePath = await moveFile(files.image, fileNames.image);
          
          query += `, image = ?`;
          updateFields.push(imagePath);
        }

        query += ` WHERE id = ? AND artist_id = ?`;
        updateFields.push(id, session.user.id);

        const [result] = await connection.execute(query, updateFields);

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Product not found or unauthorized' });
        }

        return res.status(200).json({ 
          message: 'Product updated successfully'
        });
      }

      case 'DELETE': {
        if (session.user.role !== 'artist') {
          return res.status(403).json({ error: 'Forbidden - Artist access required' });
        }

        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ error: 'Product ID is required' });
        }

        // Get file paths before deletion
        const [files] = await connection.execute(
          'SELECT model_path, preview_path, image FROM product WHERE id = ? AND artist_id = ?',
          [id, session.user.id]
        );

        if (files?.[0]) {
          // Delete files from filesystem
          await cleanupFiles([
            files[0].model_path && path.join(process.cwd(), 'public', files[0].model_path),
            files[0].preview_path && path.join(process.cwd(), 'public', files[0].preview_path),
            files[0].image && path.join(process.cwd(), 'public', files[0].image)
          ].filter(Boolean));
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

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  } finally {
    if (connection) await connection.release();
  }
}