const express = require("express");
const router = express.Router();

const {
    getIntakes,
    createIntake,
    getMedicationHistory
} = require("../controllers/intakesController");

router.get("/", getIntakes);
router.post("/", createIntake);
router.get("/history/:id", getMedicationHistory);

module.exports = router;