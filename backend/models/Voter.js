const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say"], required: false },
  dob: { type: String },
  aadhaar: { type: String, required: true, unique: true, index: true },
  walletAddress: { type: String, required: true, unique: true, index: true },
  hasVoted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Voter", voterSchema);


