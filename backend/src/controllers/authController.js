const supabase = require("../config/supabase");

const register = async (req, res) => {

    const { name, email, password } = req.body;

    // Crear usuario en Supabase
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        return res.status(500).json(error);
    }

    // Guardar datos extra en tabla users
    const { error: userError } = await supabase
        .from("users")
        .insert([
            {
                id: data.user.id,
                name,
                email
            }
        ]);

    if (userError) {
        return res.status(500).json(userError);
    }

    res.status(201).json({
        message: "Usuario creado",
        user: data.user
    });
}

const login = async (req, res) => {

    const { email, password } = req.body;

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

module.exports = {
    register,
    login
};