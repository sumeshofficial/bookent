import { verifyTokenAndGetUser } from "../services/auth.service.js";


// Token verify
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyTokenAndGetUser(token);

    if(user && user?.status === 'blocked') return res.status(401).json({ message: "You are bloked by admin" });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message || "Invalid token" });
  }
};