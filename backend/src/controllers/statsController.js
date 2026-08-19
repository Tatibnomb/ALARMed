const supabase = require("../config/supabase");
const { medicationBelongsToUser } = require("../utils/ownership");

const getAdherence = async (req, res) => {

    const { id } = req.params;

    const owns = await medicationBelongsToUser(
        id,
        req.user.id
    );

    if (!owns) {
        return res.status(403).json({
            message: "No podés ver estadísticas de un medicamento que no te pertenece"
        });
    }

    const { data, error } = await supabase
        .from("intakes")
        .select("*")
        .eq("medication_id", id);

    if (error) {
        return res.status(500).json(error);
    }

    const total = data.length;

    const taken = data.filter(
        item => item.taken === true
    ).length;

    const missed = total - taken;

    const adherence = total === 0
        ? 0
        : ((taken / total) * 100).toFixed(2);

    res.json({
        total_doses: total,
        taken_doses: taken,
        missed_doses: missed,
        adherence_percentage: adherence
    });
};

module.exports = {
    getAdherence
};