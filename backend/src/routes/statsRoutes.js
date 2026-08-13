const express = require("express");
const router = express.Router();
const { medicationBelongsToUser } = require("../utils/ownership");

const getAdherence = async (req, res) => {

    const { id } = req.params;

    const owns = await medicationBelongsToUser(id, req.user.id);

    if (!owns) {
        return res.status(403).json({
            message: "No podés ver estadísticas de un medicamento que no te pertenece"
        });
    }

router.get("/adherence/:id", authMiddleware, getAdherence);

module.exports = router;
}