import { supabase } from "../config/db.js";

export default async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      return res.status(401).json({ success: false, message: "Sign in to access this resource." });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ success: false, message: "Your session is invalid or expired. Please sign in again." });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    };
    next();
  } catch (error) {
    next(error);
  }
}
