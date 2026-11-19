import { query } from '../config/db.js';
import { config } from '../config/env.js';
import { sendMail } from '../utils/mailer.js';

const COLUMNS = 'id, first_name, last_name, email, code, zip_code, message, status, created_at';

// Public: submit the "Get a Free Consultation" form.
// The request is stored in the DB (visible in /admin/messages) and emailed
// to the site owner via the server's sendmail when NOTIFY_EMAIL is set.
export async function createConsultation(req, res, next) {
  try {
    const { firstName, lastName = '', email, code = '', zipCode = '', message } = req.body || {};
    if (!firstName || !email || !message) {
      return res.status(400).json({ message: 'First name, email and message are required' });
    }
    const clean = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      code: code.trim(),
      zipCode: zipCode.trim(),
      message: message.trim(),
    };
    const { rows } = await query(
      `INSERT INTO consultation_requests (first_name, last_name, email, code, zip_code, message)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
      [clean.firstName, clean.lastName, clean.email, clean.code, clean.zipCode, clean.message]
    );

    const lines = [
      `Name: ${clean.firstName} ${clean.lastName}`.trim(),
      `Email: ${clean.email}`,
      clean.code || clean.zipCode ? `Phone: ${[clean.code, clean.zipCode].filter(Boolean).join(' ')}` : null,
      '',
      'Message:',
      clean.message,
      '',
      `Submitted via olamartins.com at ${new Date().toISOString()}`,
    ].filter((l) => l !== null);

    const notify = await sendMail({
      to: config.mail.notifyTo,
      subject: `New consultation request from ${clean.firstName} — olamartins.com`,
      text: lines.join('\n'),
    });
    if (!notify.sent) console.warn('Consultation email not sent:', notify.reason);
    await sendMail({
      to: clean.email,
      subject: 'We received your consultation request — Ola Martins',
      text: `Hi ${clean.firstName},\n\nThank you for reaching out via olamartins.com. Your consultation request has been received and Ola will reply within one business day.\n\nYour message:\n${clean.message}\n\n— Ola Martins (olamartins.com)`,
    });

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
