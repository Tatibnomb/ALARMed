const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    getMedications,
    createMedication,
    updateMedication,
    deleteMedication
} = require("../controllers/medicationsController");

router.get("/", authMiddleware, getMedications);
router.post("/", authMiddleware, createMedication);
router.put("/:id", authMiddleware, updateMedication);
router.delete("/:id", authMiddleware, deleteMedication);

module.exports = router;