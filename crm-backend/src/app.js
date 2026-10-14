const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const enquiryRoutes = require('./routes/enquiry.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);
app.use('/api/enquiries', rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }), enquiryRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'crm-api' }));
app.use(notFound);
app.use(errorHandler);
module.exports = app;
