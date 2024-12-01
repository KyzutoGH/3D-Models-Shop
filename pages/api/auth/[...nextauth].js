import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Ensure the user ID is available in the session
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Save the user's ID in the token
      }
      return token;
    },
  },
  session: {
    strategy: "jwt", // Ensure JWT is used for session management
  },
  pages: {
    // Redirect to profile after successful login
    signIn: '/login', // Optional: Define the custom login page
    error: '/login',  // Optional: Define a custom error page
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to /profile after successful login
      return baseUrl + '/profile';
    },
  },
});
