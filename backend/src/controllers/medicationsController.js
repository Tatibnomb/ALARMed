const supabase = require("../config/supabase");

const getMedications = async (req, res) => {

    const { data, error } = await supabase
        .from("medications")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

const createMedication = async (req, res) => {

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
};

const updateMedication = async (req, res) => {

    const { id } = req.params;
    const { name, dosage, description, frequency } = req.body;

    const { data, error } = await supabase
        .from("medications")
        .update({
            name,
            dosage,
            description,
            frequency
        })
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

const deleteMedication = async (req, res) => {

    const { id } = req.params;

    const { error } = await supabase
        .from("medications")
        .delete()
        .eq("id", id);

    if (error) {
        return res.status(500).json(error);
    }

    res.json({
        message: "Medicamento eliminado"
    });
};

module.exports = {
    getMedications,
    createMedication,
    updateMedication,
    deleteMedication
};