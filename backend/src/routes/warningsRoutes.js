const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  syncUserWarnings,
  getUserMedicationsWithWarnings
} = require("../controllers/warningsController");

router.post("/sync", authMiddleware, syncUserWarnings);
router.get("/", authMiddleware, getUserMedicationsWithWarnings);

module.exports = router;