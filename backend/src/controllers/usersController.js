const supabase = require("../config/supabase");

const getUsers = async (req, res) => {

    const { data, error } = await supabase
        .from("users")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

const createUser = async (req, res) => {

    const { name, email } = req.body;

    const { data, error } = await supabase
        .from("users")
        .insert([{ name, email }])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);
};

module.exports = {
    getUsers,
    createUser
};