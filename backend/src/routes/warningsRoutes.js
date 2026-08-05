const express = require("express");

const router = express.Router();

const {
    getWarnings
} = require("../controllers/warningsController");

router.get("/:id", getWarnings);

module.exports = router;