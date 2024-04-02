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
        // Verificar si el cliente Redis está disponible y no cerrado
        if (redisClient && !redisClient.closed) {
            redisClient.set('notificaciones', JSON.stringify(data));
        } else {
            console.error('El cliente Redis está cerrado. Vuelve a conectarlo o maneja la situación adecuadamente.');
        }

        // Enviar la notificación a todos los usuarios conectados
        io.emit('nuevaNotificacion', data);
    });
});

server.listen(3000, () => {
    console.log('Servidor de notificaciones corriendo en el puerto 3000');
});