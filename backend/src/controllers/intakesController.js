const supabase = require("../config/supabase");

const getIntakes = async (req, res) => {

    const { data, error } = await supabase
        .from("intakes")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

const getIntakesByMedication = async (req, res) => {

    const { id } = req.params;

    const { data, error } = await supabase
        .from("intakes")
        .select("*")
        .eq("medication_id", id);

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

const createIntake = async (req, res) => {

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
};

module.exports = {
    getIntakes,
    getIntakesByMedication,
    createIntake
};