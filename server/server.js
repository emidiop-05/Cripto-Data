// server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");

// IMPORTS
const cryptoRoutes = require("./routes/cryptoRoutes");
const userRoutes = require("./routes/userRoutes"); // <--- 1. ADD THIS IMPORT

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // <--- This allows the server to read the JSON body you send in Postman

// ROUTES
// This handles the Crypto data
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
// (We will move the crypto logic to its own route later, but keep it here for now if you want)
app.get("/api/crypto", async (req, res) => {
  /* ... your existing crypto code ... */
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        headers: { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY },
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
          sparkline: true,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("API ERROR:", error.message);
    res.status(500).json({ error: "Failed to fetch data from CoinGecko" });
  }
});

// 2. ADD THIS LINE: Connect the /api/users URL to your userRoutes file
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
