const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');

let whiteboardState = [];

app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('New connection established');

  socket.on('draw', (data) => {
    whiteboardState.push(data);
    socket.broadcast.emit('draw', data);
  });

  socket.on('clear', () => {
    whiteboardState = [];
    socket.broadcast.emit('clear');
  });

  socket.on('disconnect', () => {
    console.log('Connection closed');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});