// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();

// app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
// app.use(express.json({ limit: "100mb" })); // Increase limit to handle base64 images
// app.use(express.urlencoded({ limit: "100mb", extended: true }));

// // Health check
// app.get("/health", (_req, res) => {
//   res.json({ ok: true }); 
// });

// // Routes
// const voterRoutes = require("./routes/voters");
// const candidateRoutes = require("./routes/candidates");
// app.use("/api/voters", voterRoutes);
// app.use("/api/candidates", candidateRoutes);

// const PORT = process.env.PORT || 4000;
// const MONGODB_URI = process.env.MONGODB_URI || "";

// if (!MONGODB_URI) {
//   console.error("Missing MONGODB_URI in environment");
//   process.exit(1);
// }

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     console.log("Connected to MongoDB");
//     app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
//   })
//   .catch(err => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   });

// module.exports = app;




// index.js (Updated)

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ethers } = require("ethers"); // <--- ADD THIS
const abi = require("./VotingABI.json"); // <--- ADD THIS

// --- Load All Environment Variables ---
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const AMOY_RPC_URL = process.env.AMOY_RPC_URL;
const SERVER_PRIVATE_KEY = process.env.SERVER_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// --- Basic App Setup ---
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// --- Blockchain Connection ---
// Set up the provider, server wallet, and contract instance
if (!AMOY_RPC_URL || !SERVER_PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.error("Missing blockchain environment variables (RPC_URL, PRIVATE_KEY, or CONTRACT_ADDRESS)");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(AMOY_RPC_URL);
const wallet = new ethers.Wallet(SERVER_PRIVATE_KEY, provider);
const votingContract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

console.log(`Connected to smart contract at: ${CONTRACT_ADDRESS}`);

// --- Middleware to Pass Contract to Routes ---
// This makes `req.contract` available in all your route files
app.use((req, res, next) => {
  req.contract = votingContract;
  next(); // Go to the next route
});

// --- Routes (Your code) ---
const voterRoutes = require("./routes/voters");
const candidateRoutes = require("./routes/candidates");
app.use("/api/voters", voterRoutes);
app.use("/api/candidates", candidateRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true }); 
});

// --- Database & Server Start ---
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = app;