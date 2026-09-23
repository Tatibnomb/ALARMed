const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getWarnings, regenerateWarnings } = require("../controllers/warningsController");

router.get("/", authMiddleware, getWarnings);
router.post("/regenerate", authMiddleware, regenerateWarnings);

module.exports = router;