const { supabase } = require("../config/supabase");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado o inválido." });
    }

    const token = authHeader.split(" ")[1];

    // Validamos el token utilizando Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Sesión inválida o expirada." });
    }

    // Adjuntamos la información del usuario a la request
    req.user = user;
    next();
  } catch (err) {
    console.error("Error en authMiddleware:", err);
    return res.status(500).json({ message: "Error al autenticar la petición." });
  }
};

module.exports = authMiddleware;