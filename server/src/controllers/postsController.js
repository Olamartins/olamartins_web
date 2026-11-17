import { query } from '../config/db.js';
import { slugify } from '../utils/slugify.js';
import { ensureUniqueSlug } from '../utils/ensureUniqueSlug.js';

const COLUMNS = 'id, title, slug, excerpt, content, cover_image, published, created_at, updated_at';

function buildListQuery({ includeUnpublished }) {
  return async (req, res, next) => {
    try {
      const { q, limit } = req.query;
      const where = [includeUnpublished ? 'TRUE' : 'published = TRUE'];
      const params = [];
      if (q) {
        params.push(`%${q}%`);
        where.push(`(title ILIKE $${params.length} OR excerpt ILIKE $${params.length})`);
      }
      let sql = `SELECT ${COLUMNS} FROM posts WHERE ${where.join(' AND ')} ORDER BY created_at DESC`;
      if (limit) {
        params.push(Number(limit));
        sql += ` LIMIT $${params.length}`;
      }
      const { rows } = await query(sql, params);
      res.json({ posts: rows });
    } catch (err) {
      next(err);
    }
  };
}

export const listPosts = buildListQuery({ includeUnpublished: false });
export const listAllPosts = buildListQuery({ includeUnpublished: true });

export async function getPostBySlug(req, res, next) {
  try {
    const { rows } = await query(`SELECT ${COLUMNS} FROM posts WHERE slug = $1 AND published = TRUE`, [req.params.slug]);
    if (!rows[0]) return res.status(404).json({ message: 'Article not found' });
    res.json({ post: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req, res, next) {
  try {
    const { title, excerpt = '', content = '', cover_image = '', published = true } = req.body || {};
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
    const slug = await ensureUniqueSlug('posts', slugify(title));
    const { rows } = await query(
      `INSERT INTO posts (title, slug, excerpt, content, cover_image, published)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${COLUMNS}`,
      [title, slug, excerpt, content, cover_image, published]
    );
    res.status(201).json({ post: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req, res, next) {
  try {
    const { id } = req.params;
    const { title, excerpt = '', content = '', cover_image = '', published = true } = req.body || {};
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
    const slug = await ensureUniqueSlug('posts', slugify(title), Number(id));
    const { rows } = await query(
      `UPDATE posts SET title = $1, slug = $2, excerpt = $3, content = $4, cover_image = $5, published = $6
       WHERE id = $7 RETURNING ${COLUMNS}`,
      [title, slug, excerpt, content, cover_image, published, id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Article not found' });
    res.json({ post: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req, res, next) {
  try {
    const { rows } = await query('DELETE FROM posts WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (err) {
    next(err);
  }
}
