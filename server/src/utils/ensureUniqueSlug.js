import { query } from '../config/db.js';

// Returns `base` if free, otherwise `base-2`, `base-3`, ...
export async function ensureUniqueSlug(table, base, excludeId = null) {
  let slug = base;
  let counter = 2;
  for (;;) {
    const params = [slug];
    let sql = `SELECT id FROM ${table} WHERE slug = $1`;
    if (excludeId) {
      params.push(excludeId);
      sql += ` AND id <> $${params.length}`;
    }
    const { rows } = await query(sql, params);
    if (rows.length === 0) return slug;
    slug = `${base}-${counter++}`;
  }
}
