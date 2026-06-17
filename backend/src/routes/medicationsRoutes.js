const express = require("express");
const router = express.Router();

const {
    getMedications,
    createMedication,
    updateMedication,
    deleteMedication
} = require("../controllers/medicationsController");

router.get("/", getMedications);
router.post("/", createMedication);
router.put("/:id", updateMedication);
router.delete("/:id", deleteMedication);

module.exports = router;