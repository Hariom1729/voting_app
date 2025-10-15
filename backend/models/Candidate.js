const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  party: { type: String, default: "Independent" },
  aadhaar: { type: String, required: true, unique: true, index: true },
  walletAddress: { type: String, required: true, unique: true, index: true },
  votes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);


