import { query } from '../config/db.js';

const COLUMNS = 'id, first_name, last_name, email, code, zip_code, message, status, created_at';

// Public: submit the "Get a Free Consultation" form
export async function createConsultation(req, res, next) {
  try {
    const { firstName, lastName = '', email, code = '', zipCode = '', message } = req.body || {};
    if (!firstName || !email || !message) {
      return res.status(400).json({ message: 'First name, email and message are required' });
    }
    const { rows } = await query(
      `INSERT INTO consultation_requests (first_name, last_name, email, code, zip_code, message)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
      [firstName.trim(), lastName.trim(), email.toLowerCase().trim(), code.trim(), zipCode.trim(), message.trim()]
    );
    res.status(201).json({ request: rows[0], message: 'Thank you! Your consultation request has been received.' });
  } catch (err) {
    next(err);
  }
}

// Admin: list all consultation requests, newest first
export async function listConsultations(req, res, next) {
  try {
    const { rows } = await query(`SELECT ${COLUMNS} FROM consultation_requests ORDER BY created_at DESC`);
    res.json({ consultations: rows });
  } catch (err) {
    next(err);
  }
}

// Admin: mark a request as read / responded
export async function updateConsultation(req, res, next) {
  try {
    const { status } = req.body || {};
    if (!['new', 'read', 'responded'].includes(status)) {
      return res.status(400).json({ message: 'Status must be new, read or responded' });
    }
    const { rows } = await query(
      `UPDATE consultation_requests SET status = $1 WHERE id = $2 RETURNING ${COLUMNS}`,
      [status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Request not found' });
    res.json({ consultation: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deleteConsultation(req, res, next) {
  try {
    const { rows } = await query('DELETE FROM consultation_requests WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted' });
  } catch (err) {
    next(err);
  }
}

// Admin dashboard counters
export async function getStats(req, res, next) {
  try {
    const { rows } = await query(`
      SELECT
        (SELECT COUNT(*) FROM posts WHERE published = TRUE)              AS posts,
        (SELECT COUNT(*) FROM resources WHERE published = TRUE)          AS resources,
        (SELECT COUNT(*) FROM products WHERE published = TRUE)           AS products,
        (SELECT COUNT(*) FROM consultation_requests WHERE status = 'new') AS new_messages
    `);
    const s = rows[0];
    res.json({
      stats: {
        posts: Number(s.posts),
        resources: Number(s.resources),
        products: Number(s.products),
        newMessages: Number(s.new_messages),
      },
    });
  } catch (err) {
    next(err);
  }
}
