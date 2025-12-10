require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/crypto", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        headers: { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY },
        params: {
          vs_currency: "eur",
          order: "market_cap_desc",
          per_page: 100,
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

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
