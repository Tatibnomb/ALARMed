const supabase = require("../config/supabase");

const getMedications = async (req, res) => {

    const { data, error } = await supabase
        .from("medications")
        .select(`
            *,
            schedules (*)
            `)
        .eq("user_id", req.user.id);

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

const createMedication = async (req, res) => {
    
    const {
        name,
        dosage,
        description,
        frequency,
        hour
    } = req.body;

    
// Valida los datos principales
if (!name || !dosage || !frequency || !hour) {
    return res.status(400).json({
        message: "Faltan datos del medicamento o del horario"
        });
    }

 // Crea el medicamento
    const { data: medicationData, error: medicationError } =
        await supabase
            .from("medications")
            .insert([
                {
                    user_id: req.user.id,
                    name,
                    dosage,
                    description,
                    frequency
                }
            ])
            .select()
            .single();


    if (medicationError) {
        return res.status(500).json(medicationError);
    }

// Obtiene el ID del medicamento creado
    const medicationId = medicationData.id;

// Crea el horario asociado
    const { data: scheduleData, error: scheduleError } =
        await supabase
            .from("schedules")
            .insert([
                {
                    medication_id: medicationId,
                    hour
                }
            ])
            .select()
            .single();

// Si falla la creación del horario, avisa del error.
    if (scheduleError) {
        return res.status(500).json({
            message: "El medicamento se creó, pero no se pudo guardar el horario",
            error: scheduleError
        });
    }

// Devuelve medicamento + horario
    res.status(201).json({
        medication: medicationData,
        schedule: scheduleData
    });
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
        .eq("user_id", req.user.id)
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
        .eq("id", id)
        .eq("user_id", req.user.id);

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