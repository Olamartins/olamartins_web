import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.resolve(here, '../../uploads');

const MIME_EXT = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

// Admin-only image upload. The client sends a base64 data URL (JSON body),
// so no multipart dependency is needed. Files land in server/uploads and are
// served at /uploads/<file>.
export async function uploadImage(req, res, next) {
  try {
    const { name = 'image', dataUrl } = req.body || {};
    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl || '');
    if (!match) return res.status(400).json({ message: 'A base64 image data URL is required' });
    const ext = MIME_EXT[match[1]];
    if (!ext) return res.status(400).json({ message: 'Unsupported image type (png, jpg, webp, gif, svg)' });
    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length > 8 * 1024 * 1024) return res.status(413).json({ message: 'Image too large (max 8 MB)' });

    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const safe = String(name).replace(/[^a-z0-9-_]/gi, '-').replace(/-+/g, '-').slice(0, 40) || 'image';
    const filename = `${Date.now()}-${safe}${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
    res.status(201).json({ url: `/uploads/${filename}` });
  } catch (err) {
    next(err);
  }
}
