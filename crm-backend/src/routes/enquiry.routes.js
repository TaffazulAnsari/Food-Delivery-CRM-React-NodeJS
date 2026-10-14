const router = require('express').Router();
const mongoose = require('mongoose');
const Enquiry = require('../models/Enquiry');
const authenticate = require('../middleware/auth.middleware');

// Public form: intentionally does not use authentication middleware.
router.post('/', async (req, res) => {
  const { name, email, phone = '', courseInterest, message = '' } = req.body;
  if (!name || !email || !courseInterest) {
    return res.status(400).json({ message: 'name, email and courseInterest are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }
  const enquiry = await Enquiry.create({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone).trim(),
    courseInterest: String(courseInterest).trim(),
    message: String(message).trim()
  });
  res.status(201).json({ message: 'Enquiry submitted successfully.', enquiry });
});

router.use(authenticate);

router.get('/public', async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const filter = { claimedBy: null };
  const [enquiries, total] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Enquiry.countDocuments(filter)
  ]);
  res.json({ enquiries, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

router.get('/my-leads', async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const filter = { claimedBy: req.employee._id };
  const [enquiries, total] = await Promise.all([
    Enquiry.find(filter).sort({ claimedAt: -1 }).skip((page - 1) * limit).limit(limit),
    Enquiry.countDocuments(filter)
  ]);
  res.json({ enquiries, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

router.patch('/:id/claim', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid enquiry ID.' });

  // Atomic conditional update: only one counselor can claim an unclaimed enquiry.
  const enquiry = await Enquiry.findOneAndUpdate(
    { _id: req.params.id, claimedBy: null },
    { $set: { claimedBy: req.employee._id, claimedAt: new Date() } },
    { new: true, runValidators: true }
  );
  if (enquiry) return res.json({ message: 'Enquiry claimed successfully.', enquiry });

  const existing = await Enquiry.findById(req.params.id).select('_id claimedBy');
  if (!existing) return res.status(404).json({ message: 'Enquiry not found.' });
  return res.status(409).json({ message: 'This enquiry has already been claimed by another counselor.' });
});

module.exports = router;
