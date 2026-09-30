const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    getSchedules,
    createSchedule
} = require("../controllers/schedulesController");

router.get("/", authMiddleware, getSchedules);
router.post("/", authMiddleware, createSchedule);

module.exports = router;