import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../pages/api/auth/[...nextauth]"; // Mengimpor authOptions dari konfigurasi NextAuth

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Mendapatkan sesi pengguna saat ini menggunakan authOptions
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      // Jika tidak ada sesi (sudah logout)
      return res.status(200).json({ message: 'Already logged out' });
    }

    // Menghapus cookie sesi (logout)
    res.setHeader(
      'Set-Cookie',
      'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; Secure; SameSite=Lax'
    );

    // Redirect ke halaman login setelah logout berhasil
    res.redirect('/auth/signin'); // Menambahkan redirect setelah logout berhasil

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout', error: error.message });
  }
}
