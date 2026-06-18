const express = require("express");
const router = express.Router();

const {
    getAdherence
} = require("../controllers/statsController");

router.get("/adherence/:id", getAdherence);

module.exports = router;