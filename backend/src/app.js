const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API funcionando");
});

// GET USERS
app.get("/users", async (req, res) => {

    const { data, error } = await supabase
        .from("users")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);

});

// POST USERS
app.post("/users", async (req, res) => {

    const { name, email } = req.body;

    const { data, error } = await supabase
        .from("users")
        .insert([{ name, email }])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);

});

// GET MEDICATIONS
app.get("/medications", async (req, res) => {

    const { data, error } = await supabase
        .from("medications")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);

});

// POST MEDICATIONS
app.post("/medications", async (req, res) => {

    const { user_id, name, dosage, description } = req.body;

    const { data, error } = await supabase
        .from("medications")
        .insert([
            {
                user_id,
                name,
                dosage,
                description
            }
        ])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);

});

app.get("/schedules", async (req, res) => {

    const { data, error } = await supabase
        .from("schedules")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);

});

app.post("/schedules", async (req, res) => {

    const { medication_id, hour } = req.body;

    const { data, error } = await supabase
        .from("schedules")
        .insert([
            {
                medication_id,
                hour
            }
        ])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);

});

app.get("/intakes", async (req, res) => {

    const { data, error } = await supabase
        .from("intakes")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);

});

app.get("/intakes/medication/:id", async (req, res) => {

    const { id } = req.params;

    const { data, error } = await supabase
        .from("intakes")
        .select("*")
        .eq("medication_id", id);

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);

});

app.post("/intakes", async (req, res) => {

    const { medication_id, taken } = req.body;

    const { data, error } = await supabase
        .from("intakes")
        .insert([
            {
                medication_id,
                taken
            }
        ])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);

});

module.exports = app;