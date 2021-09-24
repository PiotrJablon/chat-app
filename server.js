const express = require('express');
const path = require('path');
const socket = require('socket.io');
const app = express();

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('join', (user) => {
    console.log('Client ' + socket.id + ' name is - ' + user.name);
    users.push({ name: user.name, id: socket.id });
    socket.broadcast.emit('message', { author: 'Chat bot', content: user.name + ' has joined the conversation!' });
  });
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    const removeUser = users.map(user => user.id).indexOf(socket.id);
    const user = users.find(x => x.id == socket.id);
    users.splice(removeUser, 1);
    socket.broadcast.emit('message', { author: 'Chat bot', content: user.name + ' has left the conversation :/' });
  });
  console.log('I\'ve added a listener on message and disconnect events \n');
});