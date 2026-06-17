const express = require("express");
const cors = require("cors");

const usersRoutes = require("./routes/usersRoutes");
const medicationsRoutes = require("./routes/medicationsRoutes");
const schedulesRoutes = require("./routes/schedulesRoutes");
const intakesRoutes = require("./routes/intakesRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API funcionando");
});

app.use("/users", usersRoutes);
app.use("/medications", medicationsRoutes);
app.use("/schedules", schedulesRoutes);
app.use("/intakes", intakesRoutes);

module.exports = app;