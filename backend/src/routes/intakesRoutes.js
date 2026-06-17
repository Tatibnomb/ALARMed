const express = require("express");
const router = express.Router();

const {
    getIntakes,
    getIntakesByMedication,
    createIntake
} = require("../controllers/intakesController");

router.get("/", getIntakes);
router.get("/medication/:id", getIntakesByMedication);
router.post("/", createIntake);

module.exports = router;