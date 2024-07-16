// Importa el módulo 'jsonwebtoken' para manejar la generación y verificación de tokens JWT
const jwt = require('jsonwebtoken');

// Define el middleware de autenticación
const authMiddleware = (req, res, next) => {
  // Obtiene el token del encabezado 'Authorization' y elimina el prefijo 'Bearer '
  const token = req.header('Authorization').replace('Bearer ', '');
  
  // Verifica si el token está presente
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
  }

  try {
    // Verifica el token utilizando la clave secreta
    const verified = jwt.verify(token, 'your_jwt_secret');
    // Agrega la información del usuario verificado al objeto de la solicitud
    req.user = verified;
    // Llama a la siguiente función en la cadena de middleware
    next();
  } catch (error) {
    // Responde con un error si el token no es válido
    res.status(400).json({ error: 'Token no válido' });
  }
};

// Exporta el middleware de autenticación para su uso en otras partes de la aplicación
module.exports = authMiddleware;
