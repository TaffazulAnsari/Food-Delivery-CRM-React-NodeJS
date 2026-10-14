
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Resolved"],
      default: "New"
    }
  },
  { timestamps: true }
);

const Enquiry =
  mongoose.models.Enquiry ||
  mongoose.model("Enquiry", enquirySchema);

// Get all enquiries
router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch enquiries" });
  }
});

// Create a new enquiry
router.post("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const { name, email, phone, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        message: "Name and message are required"
      });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      subject,
      message
    });

    res.status(201).json({
      message: "Enquiry created successfully",
      enquiry
    });
  } catch (error) {
    res.status(500).json({ message: "Could not create enquiry" });
  }
});

// Update enquiry status
router.patch("/:id/status", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid enquiry ID" });
    }

    const allowedStatuses = ["New", "Contacted", "Resolved"];
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json({ message: "Status updated", enquiry });
  } catch (error) {
    res.status(500).json({ message: "Could not update status" });
  }
});

// Delete an enquiry
router.delete("/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid enquiry ID" });
    }

    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete enquiry" });
  }
});

module.exports = router;
