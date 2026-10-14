const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 30, default: '' },
  courseInterest: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, trim: true, maxlength: 2000, default: '' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null, index: true },
  claimedAt: { type: Date, default: null }
}, { timestamps: true });

enquirySchema.index({ claimedBy: 1, createdAt: -1 });
module.exports = mongoose.model('Enquiry', enquirySchema);
