const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const authenticate = require('../middleware/auth.middleware');

function createToken(employee) {
  return jwt.sign({ sub: employee._id.toString(), email: employee.email, role: employee.role },
    process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password are required.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
  if (String(password).length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });

  const normalizedEmail = String(email).trim().toLowerCase();
  if (await Employee.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'Email is already registered.' });
  const employee = await Employee.create({
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 12)
  });
  const token = createToken(employee);
  res.status(201).json({
    message: 'Counselor account created.',
    token,
    employee: { id: employee._id, name: employee.name, email: employee.email, role: employee.role }
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password are required.' });
  const employee = await Employee.findOne({ email: String(email).trim().toLowerCase() }).select('+passwordHash');
  if (!employee || !(await bcrypt.compare(password, employee.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  res.json({
    message: 'Login successful.',
    token: createToken(employee),
    employee: { id: employee._id, name: employee.name, email: employee.email, role: employee.role }
  });
});

router.get('/me', authenticate, (req, res) => {
  res.json({ employee: { id: req.employee._id, name: req.employee.name, email: req.employee.email, role: req.employee.role } });
});

module.exports = router;
