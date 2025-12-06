const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  addToWatchlist,
  getMe,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);

router.put("/watchlist", protect, addToWatchlist);

router.get("/me", protect, getMe);

module.exports = router;
