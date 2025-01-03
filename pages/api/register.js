// api/register.js
import db from "../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, name, userName, password, nomorTelepon, role } = req.body;

  // Validasi input
  if (!email || !name || !userName || !nomorTelepon || !role) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  // Validasi role
  const allowedRoles = ['member', 'artist'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Role tidak valid" });
  }

  // Validasi username
  const userNameRegex = /^[a-z0-9_-]+$/;
  if (!userNameRegex.test(userName)) {
    return res.status(400).json({
      message: "Username hanya boleh mengandung huruf kecil, angka, dan simbol '-' atau '_'. Tidak boleh mengandung spasi atau huruf kapital."
    });
  }

  try {
    // Cek apakah email sudah ada
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUser] = await db.query(checkEmailQuery, [email]);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    // Hash password jika ada
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const tgl_register = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Insert data ke database
    const insertQuery = `
      INSERT INTO users (email, name, userName, role, password, nomorTelepon, tgl_register) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [email, name, userName, role, hashedPassword, nomorTelepon, tgl_register];

    const [result] = await db.query(insertQuery, values);

    return res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}