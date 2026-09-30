const { supabase } = require("../config/supabase");

const getMedications = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Usuario no autenticado." });
    }

    const { data, error } = await supabase
      .from("medications")
      .select(`
        *,
        schedules (*)
      `)
      .eq("user_id", req.user.id);

    if (error) {
      console.error("Error al obtener medicamentos:", error);
      return res.status(400).json({ message: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error("Error en getMedications:", err);
    return res.status(500).json({ message: "Error al obtener la lista de medicamentos." });
  }
};

const createMedication = async (req, res) => {
  try {
    // 1. Validar que la request tenga un usuario autenticado por el middleware
    if (!req.user?.id) {
      return res.status(401).json({ message: "No autorizado. Token no válido o ausente." });
    }

    const { name, dosage, description, frequency, hour } = req.body;

    // 2. Validar campos recibidos del frontend
    if (!name || !dosage || !frequency || !hour) {
      return res.status(400).json({
        message: "Faltan datos del medicamento o del horario.",
      });
    }

    // 3. Crear el medicamento en Supabase
    const { data: medicationData, error: medicationError } = await supabase
      .from("medications")
      .insert([
        {
          user_id: req.user.id,
          name,
          dosage,
          description: description || "",
          frequency,
        },
      ])
      .select();

    if (medicationError) {
      console.error("Error al insertar medicamento en Supabase:", medicationError);
      return res.status(400).json({ message: medicationError.message });
    }

    if (!medicationData || medicationData.length === 0) {
      return res.status(400).json({ message: "No se pudo recuperar el medicamento creado." });
    }

    const newMedication = medicationData[0];
    const medicationId = newMedication.id;

    // 4. Crear el horario asociado en la tabla schedules
    const { data: scheduleData, error: scheduleError } = await supabase
      .from("schedules")
      .insert([
        {
          medication_id: medicationId,
          hour,
        },
      ])
      .select();

    if (scheduleError) {
      console.error("Error al insertar horario en Supabase:", scheduleError);
      return res.status(201).json({
        message: "El medicamento se creó, pero ocurrió un error con el horario.",
        medication: newMedication,
        error: scheduleError.message,
      });
    }

    // 5. Retornar respuesta exitosa con los datos insertados
    return res.status(201).json({
      medication: newMedication,
      schedule: scheduleData[0],
    });

  } catch (err) {
    console.error("Error inesperado en createMedication:", err);
    return res.status(500).json({
      message: "Error interno del servidor al crear el medicamento.",
    });
  }
};

const updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dosage, description, frequency } = req.body;

    const { data, error } = await supabase
      .from("medications")
      .update({
        name,
        dosage,
        description,
        frequency,
      })
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select();

    if (error) {
      console.error("Error al actualizar medicamento:", error);
      return res.status(400).json({ message: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error("Error en updateMedication:", err);
    return res.status(500).json({ message: "Error al actualizar el medicamento." });
  }
};

const deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("medications")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (error) {
      console.error("Error al eliminar medicamento:", error);
      return res.status(400).json({ message: error.message });
    }

    return res.json({ message: "Medicamento eliminado correctamente." });
  } catch (err) {
    console.error("Error en deleteMedication:", err);
    return res.status(500).json({ message: "Error al eliminar el medicamento." });
  }
};

module.exports = {
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
};