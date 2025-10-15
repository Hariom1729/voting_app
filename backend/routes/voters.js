const express = require("express");
const Voter = require("../models/Voter");
const Candidate = require("../models/Candidate");

const router = express.Router();

// Check if wallet is already registered (as voter or candidate)
router.get("/check-wallet/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Check if wallet is registered as voter
    const existingVoter = await Voter.findOne({ walletAddress });
    if (existingVoter) {
      return res.json({ 
        isRegistered: true, 
        type: "voter", 
        message: "This wallet is already registered as a voter",
        data: existingVoter
      });
    }
    
    // Check if wallet is registered as candidate
    const existingCandidate = await Candidate.findOne({ walletAddress });
    if (existingCandidate) {
      return res.json({ 
        isRegistered: true, 
        type: "candidate", 
        message: "This wallet is already registered as a candidate",
        data: existingCandidate
      });
    }
    
    return res.json({ 
      isRegistered: false, 
      message: "Wallet is available for registration" 
    });
  } catch (err) {
    console.error("GET /api/voters/check-wallet error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Check if Aadhaar is already registered (as voter or candidate)
router.get("/check-aadhaar/:aadhaar", async (req, res) => {
  try {
    const { aadhaar } = req.params;
    
    // Check if Aadhaar is registered as voter
    const existingVoter = await Voter.findOne({ aadhaar });
    if (existingVoter) {
      return res.json({ 
        isRegistered: true, 
        type: "voter", 
        message: "This Aadhaar number is already registered as a voter",
        data: existingVoter
      });
    }
    
    // Check if Aadhaar is registered as candidate
    const existingCandidate = await Candidate.findOne({ aadhaar });
    if (existingCandidate) {
      return res.json({ 
        isRegistered: true, 
        type: "candidate", 
        message: "This Aadhaar number is already registered as a candidate",
        data: existingCandidate
      });
    }
    
    return res.json({ 
      isRegistered: false, 
      message: "Aadhaar number is available for registration" 
    });
  } catch (err) {
    console.error("GET /api/voters/check-aadhaar error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create or upsert a voter by aadhaar
router.post("/", async (req, res) => {
  try {
    const { name, gender, dob, aadhaar, walletAddress } = req.body || {};
    if (!name || !aadhaar || !walletAddress || !dob) {
      return res.status(400).json({ error: "name, aadhaar, walletAddress, and dob are required" });
    }

    // Age validation (18+ years)
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return res.status(400).json({ 
        error: `You are ${age} years old. You must be at least 18 years old to register for voting.` 
      });
    }

    // Check if wallet is already registered
    const existingVoter = await Voter.findOne({ walletAddress });
    if (existingVoter) {
      return res.status(409).json({ error: "This wallet is already registered as a voter" });
    }
    
    const existingCandidate = await Candidate.findOne({ walletAddress });
    if (existingCandidate) {
      return res.status(409).json({ error: "This wallet is already registered as a candidate" });
    }

    const voter = await Voter.findOneAndUpdate(
      { aadhaar },
      { name, gender, dob, aadhaar, walletAddress },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(201).json(voter);
  } catch (err) {
    if (err?.code === 11000) {
      const field = err.keyPattern?.aadhaar ? "Aadhaar" : "Wallet address";
      return res.status(409).json({ error: `${field} already exists` });
    }
    console.error("POST /api/voters error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;


