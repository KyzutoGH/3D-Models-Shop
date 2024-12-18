import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "../../../lib/db";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      async profile(profile) {
        try {
          const conn = await db.getConnection();
          const [user] = await conn.query(
            "SELECT * FROM users WHERE email = ?",
            [profile.email]
          );
          conn.release();

          if (user.length === 0) {
            return {
              id: profile.sub,
              email: profile.email,
              name: profile.name,
              isNewUser: true,
              googleProfile: true
            };
          }

          const dbUser = user[0];
          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            isNewUser: false
          };
        } catch (error) {
          console.error("Profile error:", error);
          throw error;
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text", placeholder: "Email or Username" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.emailOrUsername) {
            throw new Error("Email or username must be provided");
          }

          if (!credentials?.password) {
            throw new Error("Password must be provided");
          }

          const conn = await db.getConnection();
          
          const [user] = await conn.query(
            "SELECT * FROM users WHERE email = ? OR userName = ?",
            [credentials.emailOrUsername, credentials.emailOrUsername]
          );

          conn.release();

          if (user.length === 0) {
            throw new Error("No user found with these credentials");
          }

          const dbUser = user[0];
          const isPasswordValid = await bcrypt.compare(
            credentials.password, 
            dbUser.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            userName: dbUser.userName,
          };
        } catch (error) {
          console.error("Credentials error:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google" && user.isNewUser) {
        const returnUrl = `/register?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}&google=true`;
        return returnUrl;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isNewUser = user.isNewUser || false;
        token.userName = user.userName || null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.isNewUser = token.isNewUser;
      session.user.userName = token.userName;
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 900
      }
    },
    state: {
      name: `next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 900
      }
    },
    nonce: {
      name: `next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
};

export default NextAuth(authOptions);