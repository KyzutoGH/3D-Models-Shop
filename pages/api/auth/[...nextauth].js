import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from '../../../lib/db';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          const conn = await db.getConnection();
          
          // Check if user exists
          const [existingUser] = await conn.query(
            'SELECT * FROM users WHERE email = ?',
            [user.email]
          );

          if (existingUser.length === 0) {
            // Create new user if doesn't exist
            const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await conn.query(
              'INSERT INTO users (email, name, role, tgl_register) VALUES (?, ?, ?, ?)',
              [user.email, user.name, 'member', formattedDate]
            );
          }

          conn.release();
          return true;
        } catch (error) {
          console.error('Database error:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, user }) {
      try {
        const conn = await db.getConnection();
        const [dbUser] = await conn.query(
          'SELECT * FROM users WHERE email = ?',
          [session.user.email]
        );
        
        if (dbUser.length > 0) {
          session.user.role = dbUser[0].role;
          session.user.id = dbUser[0].id;
        }
        
        conn.release();
        return session;
      } catch (error) {
        console.error('Session database error:', error);
        return session;
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  events: {
    async signOut({ session, token }) {
      // Bisa tambahkan logic tambahan saat logout di sini
    },
  },
});