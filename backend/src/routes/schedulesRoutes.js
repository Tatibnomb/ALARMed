const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    getSchedules,
    createSchedule,
    updateSchedule
} = require("../controllers/schedulesController");

router.get("/", authMiddleware, getSchedules);
router.post("/", authMiddleware, createSchedule);
router.put("/:id", authMiddleware, updateSchedule);

module.exports = router;