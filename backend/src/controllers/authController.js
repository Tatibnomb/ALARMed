// ✅ Importación corregida con desestructuración { supabase }
const { supabase } = require("../config/supabase");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Crear usuario en Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Guardar datos extra en tabla users
    const { error: userError } = await supabase
      .from("users")
      .insert([
        {
          id: data.user.id,
          name,
          email,
        },
      ]);

    if (userError) {
      return res.status(500).json({ message: userError.message });
    }

    return res.status(201).json({
      message: "Usuario creado",
      user: data.user,
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  register,
  login,
};