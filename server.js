const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Coloque o domínio do seu blog aqui
    methods: ['GET', 'POST']
  }
});

// Servir arquivos estáticos diretamente da raiz do projeto
app.use(express.static(path.join(__dirname)));

// Rota básica para teste
app.get('/', (req, res) => {
  // Envia o index.html da raiz
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);

  socket.on('joinRoom', ({ nickname }) => {
    const roomId = `room-${socket.id}`;
    socket.join(roomId);
    socket.roomId = roomId;
    console.log(`${nickname} entrou na sala ${roomId}`);
    socket.emit('joined', { roomId });
  });

  socket.on('chat message', ({ nickname, msg }) => {
    if (socket.roomId) {
      io.to(socket.roomId).emit('chat message', { nickname, msg });
      console.log(`[${socket.roomId}] ${nickname}: ${msg}`);
    } else {
      io.emit('chat message', { nickname, msg });
      console.log(`[GLOBAL] ${nickname}: ${msg}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando na porta', process.env.PORT || 3000);
});
