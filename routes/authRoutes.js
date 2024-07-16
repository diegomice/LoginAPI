// Importa el módulo 'express' para crear rutas y manejar solicitudes HTTP
const express = require('express');

// Importa las funciones 'register' y 'login' desde el controlador de autenticación
const { register, login, updateUser} = require('../controllers/authController');

// Importa el middleware de autenticación
const authMiddleware = require('../middleware/authMiddleware');

// Crea una instancia de un enrutador de Express
const router = express.Router();

// Define una ruta POST para el registro de usuarios y asigna la función 'register' como manejador
router.post('/register', register);

// Define una ruta POST para el inicio de sesión de usuarios y asigna la función 'login' como manejador
router.post('/login', login);

// Define una ruta GET protegida que utiliza el middleware de autenticación
router.get('/protected', authMiddleware, (req, res) => {
  // Si la autenticación es exitosa, responde con un mensaje y la información del usuario
  res.status(200).json({ mensaje: 'Accediste a una ruta protegida', user: req.user });
});

// Ruta protegida para actualizar datos del usuario
router.put('/update', authMiddleware, updateUser);

// Exporta el enrutador para que pueda ser utilizado en otras partes de la aplicación
module.exports = router;
