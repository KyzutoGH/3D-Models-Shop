export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    try {
      // Validasi token (misalnya dengan Google atau library JWT)
      const userData = await verifyToken(token); // Implementasikan fungsi `verifyToken`
      return res.status(200).json({ user: userData });
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
  