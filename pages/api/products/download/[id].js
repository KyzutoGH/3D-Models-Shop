import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import db from '../../../../lib/db';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.query;
    let connection;

    try {
        connection = await db.getConnection();

        // Check if user has purchased this product
        const [purchases] = await connection.execute(
            `SELECT p.*, d.product_id 
   FROM transaksi p 
   JOIN detail_transaksi d 
   ON p.id = d.transaksi_id 
   WHERE p.user_id = ? AND d.product_id = ? AND p.status = 'completed'`,
            [session.user.id, id]
        );

        if (!purchases.length) {
            return res.status(403).json({ error: 'Product not purchased' });
        }

        // Get product file path
        const [products] = await connection.execute(
            'SELECT model_path FROM product WHERE id = ?',
            [id]
        );

        if (!products.length || !products[0].model_path) {
            return res.status(404).json({ error: 'Model file not found' });
        }

        const filePath = path.join(process.cwd(), 'public', products[0].model_path);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Model file not found on server' });
        }

        // Get file stats
        const stat = fs.statSync(filePath);

        // Set response headers
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);

        // Create read stream and pipe to response
        const fileStream = fs.createReadStream(filePath);

        // Handle errors
        fileStream.on('error', (error) => {
            console.error('File stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Error streaming file' });
            }
        });

        // Log download in database
        await connection.execute(
            `INSERT INTO downloads (user_id, product_id, download_date)
       VALUES (?, ?, NOW())`,
            [session.user.id, id]
        );

        // Stream file to client
        fileStream.pipe(res);
    } catch (error) {
        console.error('Download error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Server error', details: error.message });
        }
    } finally {
        if (connection) await connection.release();
    }
}