import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
import { query } from '../config/db.js';
import { signToken } from '../middleware/auth.js';

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const { rows } = await query('SELECT * FROM admins WHERE email = $1', [email.toLowerCase().trim()]);
    const admin = rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = signToken(admin);
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
    });
    res.json({ admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
}

export async function me(req, res, next) {
  try {
    const { rows } = await query('SELECT id, name, email FROM admins WHERE id = $1', [req.admin.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Admin not found' });
    res.json({ admin: rows[0] });
  } catch (err) {
    next(err);
  }
}
