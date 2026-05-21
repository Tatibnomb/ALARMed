const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("API funcionando");
});

app.get("/users", async(req,res)=>{

    const { data, error } = await supabase
        .from("users")
        .select("*");

    if(error){
        return res.status(500).json(error);
    }

    res.json(data);

});

module.exports = app;
app.post("/users", async(req,res)=>{

    const { name, email } = req.body;

    const { data, error } = await supabase
        .from("users")
        .insert([{ name, email }])
        .select();

    if(error){
        return res.status(500).json(error);
    }

    res.status(201).json(data);

});