function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, _req, res, _next) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation failed', errors: Object.values(err.errors).map(e => e.message) });
  }
  if (err.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid resource ID.' });
  console.error(err);
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Internal server error.' });
}

module.exports = { notFound, errorHandler };
