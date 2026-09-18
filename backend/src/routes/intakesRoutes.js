const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    getIntakes,
    createIntake,
    getMedicationHistory
} = require("../controllers/intakesController");

router.get("/", authMiddleware, getIntakes);
router.post("/", authMiddleware, createIntake);
router.get("/history/:id", authMiddleware, getMedicationHistory);

module.exports = router;