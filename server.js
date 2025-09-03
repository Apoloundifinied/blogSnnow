const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Ajuste para o domínio do seu blog
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Usuário conectado');
  socket.on('chat message', (data) => {
    io.emit('chat message', data); // Envia a mensagem para todos os clientes
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando');
});
