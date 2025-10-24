require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json({ limit: "100mb" })); // Increase limit to handle base64 images
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true }); 
});

// Routes
const voterRoutes = require("./routes/voters");
const candidateRoutes = require("./routes/candidates");
app.use("/api/voters", voterRoutes);
app.use("/api/candidates", candidateRoutes);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "";

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

