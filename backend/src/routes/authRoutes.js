const express = require("express");
const router = express.Router();

// Importamos desestructurando { login } desde el controlador
const { login } = require("../controllers/authController");

// Verificamos que 'login' no sea undefined
router.post("/login", login);

module.exports = router;