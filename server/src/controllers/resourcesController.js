import { query } from '../config/db.js';
import { slugify } from '../utils/slugify.js';
import { ensureUniqueSlug } from '../utils/ensureUniqueSlug.js';

const COLUMNS = 'id, title, slug, description, type, format, file_url, thumbnail, tags, published, created_at, updated_at';
const TYPES = ['ebook', 'video', 'article', 'course', 'guide'];

function buildListQuery({ includeUnpublished }) {
  return async (req, res, next) => {
    try {
      const { type, q, limit } = req.query;
      const where = [includeUnpublished ? 'TRUE' : 'published = TRUE'];
      const params = [];
      if (type) {
        params.push(type);
        where.push(`type = $${params.length}`);
      }
      if (q) {
        params.push(`%${q}%`);
        where.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
      }
      let sql = `SELECT ${COLUMNS} FROM resources WHERE ${where.join(' AND ')} ORDER BY created_at DESC`;
      if (limit) {
        params.push(Number(limit));
        sql += ` LIMIT $${params.length}`;
      }
      const { rows } = await query(sql, params);
      res.json({ resources: rows });
    } catch (err) {
      next(err);
    }
  };
}

export const listResources = buildListQuery({ includeUnpublished: false });
export const listAllResources = buildListQuery({ includeUnpublished: true });

export async function getResourceBySlug(req, res, next) {
  try {
    const { rows } = await query(`SELECT ${COLUMNS} FROM resources WHERE slug = $1 AND published = TRUE`, [req.params.slug]);
    if (!rows[0]) return res.status(404).json({ message: 'Resource not found' });
    res.json({ resource: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function createResource(req, res, next) {
  try {
    const { title, description = '', type, format = '', file_url = '', thumbnail = '', tags = [], published = true } = req.body || {};
    if (!title || !TYPES.includes(type)) {
      return res.status(400).json({ message: `Title and a valid type (${TYPES.join(', ')}) are required` });
    }
    const slug = await ensureUniqueSlug('resources', slugify(title));
    const { rows } = await query(
      `INSERT INTO resources (title, slug, description, type, format, file_url, thumbnail, tags, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING ${COLUMNS}`,
      [title, slug, description, type, format, file_url, thumbnail, Array.isArray(tags) ? tags : [], published]
    );
    res.status(201).json({ resource: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function updateResource(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description = '', type, format = '', file_url = '', thumbnail = '', tags = [], published = true } = req.body || {};
    if (!title || !TYPES.includes(type)) {
      return res.status(400).json({ message: `Title and a valid type (${TYPES.join(', ')}) are required` });
    }
    const slug = await ensureUniqueSlug('resources', slugify(title), Number(id));
    const { rows } = await query(
      `UPDATE resources SET title = $1, slug = $2, description = $3, type = $4, format = $5,
         file_url = $6, thumbnail = $7, tags = $8, published = $9
       WHERE id = $10 RETURNING ${COLUMNS}`,
      [title, slug, description, type, format, file_url, thumbnail, Array.isArray(tags) ? tags : [], published, id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Resource not found' });
    res.json({ resource: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deleteResource(req, res, next) {
  try {
    const { rows } = await query('DELETE FROM resources WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    next(err);
  }
}
