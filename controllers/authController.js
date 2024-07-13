// Importa el módulo 'bcryptjs' para manejar el hash de contraseñas
const bcrypt = require('bcryptjs');

// Importa el módulo 'Joi' para la validación de datos
const Joi = require('joi');

// Importa el modelo 'User' desde el archivo de modelos
const User = require('../models/User');

// Importa el módulo 'jsonwebtoken' para generar y verificar tokens JWT
const jwt = require('jsonwebtoken');

// Define el esquema de validación para el registro de usuarios utilizando Joi
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Exporta la función 'register' para manejar el registro de usuarios
exports.register = async (req, res) => {
  // Valida el cuerpo de la solicitud contra el esquema de registro
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, email, password } = req.body;

  try {
    // Verifica si ya existe un usuario con el mismo email
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'El usuario ya existe' });

    // Crea una nueva instancia del modelo 'User' con los datos del registro
    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10) // Hash de la contraseña
    });

    // Guarda el nuevo usuario en la base de datos
    await user.save();
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Define el esquema de validación para el inicio de sesión de usuarios utilizando Joi
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Exporta la función 'login' para manejar el inicio de sesión de usuarios
exports.login = async (req, res) => {
  // Valida el cuerpo de la solicitud contra el esquema de inicio de sesión
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;

  try {
    // Busca un usuario con el email proporcionado
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    // Compara la contraseña proporcionada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

    // Genera un token JWT con el ID del usuario
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Define el esquema de validación para la actualización de datos de usuarios utilizando Joi
const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6)
});

// Exporta la función 'updateUser' para manejar la actualización de datos de usuarios
exports.updateUser = async (req, res) => {
  // Valida el cuerpo de la solicitud contra el esquema de actualización de usuarios
  const { error } = updateUserSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const updates = req.body;

  try {
    // Si se proporciona una nueva contraseña, se hashéa antes de actualizar
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Busca y actualiza el usuario en la base de datos
    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.status(200).json({ mensaje: 'Datos del usuario actualizados exitosamente', user });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};
