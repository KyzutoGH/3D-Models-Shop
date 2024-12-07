import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "../../../lib/db";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const conn = await db.getConnection();

          // Periksa apakah pengguna sudah ada
          const [existingUser] = await conn.query(
            "SELECT * FROM users WHERE email = ?",
            [user.email]
          );

          if (existingUser.length === 0) {
            // Tambahkan pengguna baru jika belum ada
            const formattedDate = new Date()
              .toISOString()
              .slice(0, 19)
              .replace("T", " ");
            await conn.query(
              "INSERT INTO users (email, name, role, tgl_register) VALUES (?, ?, ?, ?)",
              [user.email, user.name, "member", formattedDate]
            );
          }

          conn.release();
          return true;
        } catch (error) {
          console.error("Database error during signIn:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        try {
          const conn = await db.getConnection();

          // Ambil data dari database
          const [dbUser] = await conn.query(
            "SELECT id, role FROM users WHERE email = ?",
            [user.email]
          );

          if (dbUser.length > 0) {
            token.role = dbUser[0].role;
            token.id = dbUser[0].id;
          }

          conn.release();
        } catch (error) {
          console.error("JWT database error:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Tambahkan data dari token ke session
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});
const onLogout = async (e) => {
  e.preventDefault();

  await signOut({
    callbackUrl: "/login", // Redirect setelah logout
    redirect: true,
  });
};
