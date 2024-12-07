import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "../../../lib/db";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        const conn = await db.getConnection();
        const [user] = await conn.query(
          "SELECT * FROM users WHERE email = ?",
          [profile.email]
        );

        if (user.length === 0) {
          // If user does not exist, create a new user entry
          const [newUser] = await conn.query(
            "INSERT INTO users (email, name, role) VALUES (?, ?, ?)",
            [profile.email, profile.name, "member"] // Default role as 'user'
          );
          conn.release();
          return {
            id: newUser.insertId,
            email: profile.email,
            name: profile.name,
            role: "user", // Set default role
          };
        } else {
          conn.release();
          const dbUser = user[0];
          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
          };
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const conn = await db.getConnection();
          const [user] = await conn.query(
            "SELECT * FROM users WHERE email = ?",
            [credentials.email]
          );

          if (user.length === 0) {
            throw new Error("No user found with the given email");
          }

          const dbUser = user[0];

          if (credentials.password !== dbUser.password) {
            throw new Error("Invalid credentials");
          }

          conn.release();

          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
          };
        } catch (error) {
          console.error("Credentials error:", error);
          throw new Error("Login failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
    error: "/auth/error",   // Custom error page
  },
  session: {
    strategy: "jwt", // Use JWT session strategy
    maxAge: 30 * 24 * 60 * 60, // Session expiry time
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
        sameSite: 'lax',
        path: '/',
      },
    },
  },
};

export default NextAuth(authOptions);
