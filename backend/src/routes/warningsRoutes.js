const express = require("express");
const router = express.Router();
const {
  syncUserWarnings,
  getUserMedicationsWithWarnings
} = require("../controllers/warningsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/sync", authMiddleware, syncUserWarnings);
router.get("/", authMiddleware, getUserMedicationsWithWarnings);

module.exports = router;