const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

module.exports = async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required. Send Authorization: Bearer <token>.' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(payload.sub).select('_id name email role');
    if (!employee) return res.status(401).json({ message: 'Account no longer exists.' });
    req.employee = employee;
    next();
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
