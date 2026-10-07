const express = require("express");
const cors = require("cors");

const usersRoutes = require("./routes/usersRoutes");
const medicationsRoutes = require("./routes/medicationsRoutes");
const schedulesRoutes = require("./routes/schedulesRoutes");
const intakesRoutes = require("./routes/intakesRoutes");
const statsRoutes = require("./routes/statsRoutes");
const authRoutes = require("./routes/authRoutes");
const warningsRoutes = require("./routes/warningsRoutes");
const remindersRoutes = require("./routes/remindersRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    console.log("Llegó al backend");
    res.send("API funcionando");
});

console.log("usersRoutes:", typeof usersRoutes);
console.log("medicationsRoutes:", typeof medicationsRoutes);
console.log("schedulesRoutes:", typeof schedulesRoutes);
console.log("intakesRoutes:", typeof intakesRoutes);
console.log("statsRoutes:", typeof statsRoutes);
console.log("authRoutes:", typeof authRoutes);
console.log("warningsRoutes:", typeof warningsRoutes);
console.log("remindersRoutes:", typeof remindersRoutes);

app.use("/users", usersRoutes);
app.use("/medications", medicationsRoutes);
app.use("/schedules", schedulesRoutes);
app.use("/intakes", intakesRoutes);
app.use("/stats", statsRoutes);
app.use("/auth", authRoutes);
app.use("/warnings", warningsRoutes);
app.use("/reminders", remindersRoutes);

module.exports = app;