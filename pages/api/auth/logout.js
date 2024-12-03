// pages/api/auth/logout.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(200).json({ message: 'Already logged out' });
    }

    // Clear the session cookie
    res.setHeader(
      'Set-Cookie',
      'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    );

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout', error: error.message });
  }
}