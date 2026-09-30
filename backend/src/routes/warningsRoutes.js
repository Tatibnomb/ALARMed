const express = require("express");
const router = express.Router();
const {
  syncUserWarnings,
  getUserMedicationsWithWarnings
} = require("../controllers/warningsController");

router.post("/sync/:userId", syncUserWarnings);
router.get("/user/:userId", getUserMedicationsWithWarnings);

module.exports = router;