const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar la conexión con Redis
const redisClient = redis.createClient();

// Manejar la conexión de usuarios
io.on('connection', (socket) => {
    console.log('Usuario conectado: ' + socket.id);

    // Manejar el envío de notificaciones
    socket.on('enviarNotificacion', (data) => {
        // Guardar la notificación en Redis
        redisClient.rpush('notificaciones', JSON.stringify(data));

        // Enviar la notificación a todos los usuarios conectados
        io.emit('nuevaNotificacion', data);
    });
});

server.listen(3006, () => {
    console.log('Servidor de notificaciones corriendo en el puerto 3006');
});
