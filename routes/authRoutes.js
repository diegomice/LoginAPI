// Importa el módulo 'express', que es un framework de Node.js
const express = require('express');

// Importa la función 'register' desde el controlador de autenticación
const { register,login } = require('../controllers/authController');

// Crea una instancia de un enrutador de Express
const router = express.Router();

// Define una ruta POST para '/register' que utiliza la función 'register' como controlador
router.post('/register', register);
router.post('/login', login);

// Exporta el enrutador para que pueda ser utilizado en otras partes de la aplicación
module.exports = router;
