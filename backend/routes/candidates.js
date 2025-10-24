const express = require("express");
const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter");

const router = express.Router();

// Get all candidates
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find({}).select("-aadhaar -walletAddress -__v");
    return res.json(candidates);
  } catch (err) {
    console.error("GET /api/candidates error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Check if wallet is already registered (as voter or candidate)
router.get("/check-wallet/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
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
    
    return res.json({ 
      isRegistered: false, 
      message: "Wallet is available for registration" 
    });
  } catch (err) {
    console.error("GET /api/candidates/check-wallet error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Check if Aadhaar is already registered (as voter or candidate)
router.get("/check-aadhaar/:aadhaar", async (req, res) => {
  try {
    const { aadhaar } = req.params;
    
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
    
    return res.json({ 
      isRegistered: false, 
      message: "Aadhaar number is available for registration" 
    });
  } catch (err) {
    console.error("GET /api/candidates/check-aadhaar error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create or upsert a candidate by aadhaar
router.post("/", async (req, res) => {
  try {
    const { name, party, slogan, partyIcon, aadhaar, walletAddress } = req.body || {};
    if (!name || !aadhaar || !walletAddress) {
      return res.status(400).json({ error: "name, aadhaar, and walletAddress are required" });
    }

    // Check if wallet is already registered
    const existingCandidate = await Candidate.findOne({ walletAddress });
    if (existingCandidate) {
      return res.status(409).json({ error: "This wallet is already registered as a candidate" });
    }
    
    const existingVoter = await Voter.findOne({ walletAddress });
    if (existingVoter) {
      return res.status(409).json({ error: "This wallet is already registered as a voter" });
    }

    const candidate = await Candidate.findOneAndUpdate(
      { aadhaar },
      { 
        name, 
        party: party || "Independent", 
        slogan: slogan || "",
        partyIcon: partyIcon || "",
        aadhaar, 
        walletAddress 
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(201).json(candidate);
  } catch (err) {
    if (err?.code === 11000) {
      const field = err.keyPattern?.aadhaar ? "Aadhaar" : "Wallet address";
      return res.status(409).json({ error: `${field} already exists` });
    }
    console.error("POST /api/candidates error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;


