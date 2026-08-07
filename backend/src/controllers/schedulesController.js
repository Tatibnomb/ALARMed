const supabase = require("../config/supabase");

const getSchedules = async (req, res) => {

    const { data, error } = await supabase
        .from("schedules")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

const createSchedule = async (req, res) => {

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
};

module.exports = {
    getSchedules,
    createSchedule
};