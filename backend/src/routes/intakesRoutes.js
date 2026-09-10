const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    getIntakes,
    createIntake,
    getMedicationHistory
} = require("../controllers/intakesController");

router.get("/", getIntakes);
router.post("/", createIntake);
router.get("/history/:id", getMedicationHistory);

module.exports = router;