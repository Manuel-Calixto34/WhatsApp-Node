const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const port = 3000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
  },
});

app.use(express.static('public'));

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
  console.log(`Example app listening on port ${port}`);
});
