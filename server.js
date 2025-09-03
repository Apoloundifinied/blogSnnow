const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Serve a pasta "chat" (index.html + favicon)
app.use(express.static(path.join(__dirname, 'chat')));

// Ajuste opcional de Content-Security-Policy para permitir imagens (favicon)
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self'; script-src 'self' https://cdn.socket.io");
  next();
});

io.on('connection', (socket) => {
  console.log('Novo usuário conectado:', socket.id);

  socket.on('chat message', (data) => {
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
