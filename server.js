// Importa el módulo 'express', que es un framework de Node.js
const express = require('express');


// Crea una instancia de la aplicación Express
const app = express();

// Define una ruta de prueba para la URL raíz ('/')
app.get('/', (req, res) => {
  // Envía una respuesta con el mensaje 'Hola mundo: ADSO 2024' cuando se accede a la URL raíz
  res.send('Hola mundo: ADSO 2024');
});

// configura el puerto en el que escuhara el servidor
const PORT = 5000;
app.listen(PORT, () => {
    	console.log('servidor corriendo en el puerto ${PORT}');
});