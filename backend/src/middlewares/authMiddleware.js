const supabase = require("../config/supabase");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No se proporcionó token de autenticación." });
    }

    const token = authHeader.split(" ")[1];

    // Verificar el token con Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Token inválido o expirado." });
    }

    // Guardar los datos del usuario en req.user para los controladores subsiguientes
    req.user = user;
    next();
  } catch (err) {
    console.error("Error en authMiddleware:", err);
    return res.status(500).json({ message: "Error interno en la autenticación." });
  }
};

module.exports = authMiddleware;