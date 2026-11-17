import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function signToken(admin) {
  return jwt.sign({ id: admin.id, email: admin.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

function tokenFromRequest(req) {
  if (req.cookies?.token) return req.cookies.token;
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

// Protects admin-only routes. Expects a valid JWT in the `token` cookie
// (or an `Authorization: Bearer <token>` header).
export function requireAdmin(req, res, next) {
  const token = tokenFromRequest(req);
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    req.admin = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ message: 'Session expired, please log in again' });
  }
}
