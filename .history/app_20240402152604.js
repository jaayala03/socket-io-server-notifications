const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Crear la conexión con Redis
const redisClient = redis.createClient();

// Middleware para permitir CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Manejar la conexión de usuarios
io.on('connection', (socket) => {
    console.log('Usuario conectado: ' + socket.id);

    // Manejar el envío de notificaciones
    socket.on('enviarNotificacion', (data) => {
        // Verificar si el cliente Redis está disponible y no cerrado
        if (redisClient && redisClient.connected) {
            redisClient.set('notificaciones', JSON.stringify(data), (err) => {
                if (err) {
                    console.error('Error al guardar la notificación en Redis:', err);
                }
            });
        } else {
            console.error('El cliente Redis está cerrado o no conectado.');
        }

        // Enviar la notificación a todos los usuarios conectados
        io.emit('nuevaNotificacion', data);
    });
});

// Configurar el encabezado CORS para las solicitudes de Socket.io
io.origins('http://127.0.0.1:5500');

server.listen(3006, () => {
    console.log('Servidor de notificaciones corriendo en el puerto 3006');
});
