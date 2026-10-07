const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getTodayReminders } = require("../controllers/remindersController");

router.get("/today", authMiddleware, getTodayReminders);
module.exports = router;