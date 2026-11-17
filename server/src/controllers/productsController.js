import { query } from '../config/db.js';
import { slugify } from '../utils/slugify.js';
import { ensureUniqueSlug } from '../utils/ensureUniqueSlug.js';

const COLUMNS = 'id, title, slug, description, category, price, currency, selar_url, thumbnail, features, is_featured, published, created_at, updated_at';
const CATEGORIES = ['power-bi', 'excel', 'tableau', 'ebook', 'other'];

function buildListQuery({ includeUnpublished }) {
  return async (req, res, next) => {
    try {
      const { category, q, featured, limit } = req.query;
      const where = [includeUnpublished ? 'TRUE' : 'published = TRUE'];
      const params = [];
      if (category) {
        params.push(category);
        where.push(`category = $${params.length}`);
      }
      if (featured === 'true') where.push('is_featured = TRUE');
      if (q) {
        params.push(`%${q}%`);
        where.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
      }
      let sql = `SELECT ${COLUMNS} FROM products WHERE ${where.join(' AND ')} ORDER BY created_at DESC`;
      if (limit) {
        params.push(Number(limit));
        sql += ` LIMIT $${params.length}`;
      }
      const { rows } = await query(sql, params);
      res.json({ products: rows });
    } catch (err) {
      next(err);
    }
  };
}

export const listProducts = buildListQuery({ includeUnpublished: false });
export const listAllProducts = buildListQuery({ includeUnpublished: true });

export async function getProductBySlug(req, res, next) {
  try {
    const { rows } = await query(`SELECT ${COLUMNS} FROM products WHERE slug = $1 AND published = TRUE`, [req.params.slug]);
    if (!rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json({ product: rows[0] });
  } catch (err) {
    next(err);
  }
}

function normalizeFeatures(features) {
  return Array.isArray(features) ? features.filter((f) => typeof f === 'string' && f.trim()) : [];
}

export async function createProduct(req, res, next) {
  try {
    const {
      title, description = '', category, price = 0, currency = 'USD', selar_url,
      thumbnail = '', features = [], is_featured = false, published = true,
    } = req.body || {};
    if (!title || !CATEGORIES.includes(category) || !selar_url) {
      return res.status(400).json({ message: `Title, a valid category (${CATEGORIES.join(', ')}) and a Selar URL are required` });
    }
    const slug = await ensureUniqueSlug('products', slugify(title));
    const { rows } = await query(
      `INSERT INTO products (title, slug, description, category, price, currency, selar_url, thumbnail, features, is_featured, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING ${COLUMNS}`,
      [title, slug, description, category, Number(price), currency, selar_url, thumbnail, JSON.stringify(normalizeFeatures(features)), is_featured, published]
    );
    res.status(201).json({ product: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const {
      title, description = '', category, price = 0, currency = 'USD', selar_url,
      thumbnail = '', features = [], is_featured = false, published = true,
    } = req.body || {};
    if (!title || !CATEGORIES.includes(category) || !selar_url) {
      return res.status(400).json({ message: `Title, a valid category (${CATEGORIES.join(', ')}) and a Selar URL are required` });
    }
    const slug = await ensureUniqueSlug('products', slugify(title), Number(id));
    const { rows } = await query(
      `UPDATE products SET title = $1, slug = $2, description = $3, category = $4, price = $5,
         currency = $6, selar_url = $7, thumbnail = $8, features = $9, is_featured = $10, published = $11
       WHERE id = $12 RETURNING ${COLUMNS}`,
      [title, slug, description, category, Number(price), currency, selar_url, thumbnail, JSON.stringify(normalizeFeatures(features)), is_featured, published, id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json({ product: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { rows } = await query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}
