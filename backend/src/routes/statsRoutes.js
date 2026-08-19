const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
    getAdherence
} = require("../controllers/statsController");

router.get(
    "/adherence/:id",
    authMiddleware,
    getAdherence
);

module.exports = router;