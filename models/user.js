// Importa el módulo 'mongoose' para trabajar con MongoDB
const mongoose = require('mongoose');

// Define el esquema del usuario utilizando mongoose.Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['usuario', 'admin', 'vendedor'],
    default: 'usuario'
  }
});

// Crea y exporta el modelo 'User' basado en el esquema definido
const User = mongoose.model('User', UserSchema);

module.exports = User;
