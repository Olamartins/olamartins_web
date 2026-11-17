export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err?.code === '23505') {
    return res.status(409).json({ message: 'A record with this value already exists' });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}
