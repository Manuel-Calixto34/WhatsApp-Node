const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = (process.env.CORS_ORIGINS || [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://whatsappnode-f49e1.web.app',
].join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

let count = 0;

io.on('connection', (socket) => {
  count++;
  console.log('Se han conectado: ' + count + ' usuarios');
  io.emit('numeroUsuarios', count);

  socket.on('disconnect', () => {
    count--;
    console.log('user disconnected');
    io.emit('numeroUsuarios', count);
  });

  socket.on('mensajeTexto', (datos) => {
    console.log('He recibido esto: ' + datos);
    io.emit('mensaje', datos);
  });

  socket.on('nombreUsuario', (nombre) => {
    console.log(nombre.nombreUsuario + ' ha entrado en el canal');
    socket.nombreUsuario = nombre;
    socket.broadcast.emit('nombreUsuario', nombre.nombreUsuario);
  });

  socket.on('escribiendo', (nombre) => {
    socket.broadcast.emit('escribiendo', nombre);
  });

});


server.listen(port, () => {
  console.log(`Socket server listening on port ${port}`);
});
