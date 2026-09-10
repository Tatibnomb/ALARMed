const express = require("express");
const cors = require("cors");

const usersRoutes = require("./routes/usersRoutes");
const medicationsRoutes = require("./routes/medicationsRoutes");
const schedulesRoutes = require("./routes/schedulesRoutes");
const intakesRoutes = require("./routes/intakesRoutes");
const statsRoutes = require("./routes/statsRoutes");
const authRoutes = require("./routes/authRoutes");
// const warningsRoutes = require("./routes/warningsRoutes");

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

app.use("/users", usersRoutes);
app.use("/medications", medicationsRoutes);
app.use("/schedules", schedulesRoutes);
app.use("/intakes", intakesRoutes);
app.use("/stats", statsRoutes);
app.use("/auth", authRoutes);
// app.use("/warnings", warningsRoutes);

module.exports = app;