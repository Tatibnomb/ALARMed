const supabase = require("../config/supabase");

module.exports = async (req, res, next) => {

    const token = req.headers.authorization?.replace("Bearer ", ""); // Busca algo como esto: eyJhbGciOi...
    // y se queda solo con el token del proyecto en Supabase

    if (!token) { // Si no encuentra el token
        return res.status(401).json({
            message: "Token no proporcionado"
        });
    }

    const { data, error } = await supabase.auth.getUser(token); // Consulta a Supabase

    if (error) { // Si el token no es válido
        return res.status(401).json({
            message: "Token inválido"
        });
    }
// Si todo está bien...
    req.user = data.user; // Guarda el usuario autenticado para que los controladores puedan
    // usarlo más adelante.

    next();

};