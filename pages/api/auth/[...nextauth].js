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
    // Handling signIn to ensure the user is added to the database with a role
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

    // Adding the role to the session from the database
    async session({ session, user }) {
      try {
        const conn = await db.getConnection();
        const [dbUser] = await conn.query(
          'SELECT * FROM users WHERE email = ?',
          [session.user.email]
        );
        
        if (dbUser.length > 0) {
          session.user.role = dbUser[0].role; // Adding role to session
          session.user.id = dbUser[0].id; // Adding user id to session
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
    signIn: '/auth/signin', // Custom sign-in page
    error: '/auth/error',   // Custom error page for login
  },
  events: {
    async signOut({ session, token }) {
      // You can add additional logic during sign-out if needed
    },
  },
});
