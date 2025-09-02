const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

// Serve arquivos estáticos (opcional)
// app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Novo usuário conectado:', socket.id);

  socket.on('chat message', (data) => {
    // Broadcast para todos os clientes
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
