const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    getSchedules,
    createSchedule
} = require("../controllers/schedulesController");

router.get("/", getSchedules);
router.post("/", createSchedule);

module.exports = router;