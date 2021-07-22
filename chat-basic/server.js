const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 7000 || process.env.PORT;

// html과 같은 정적 파일 Set 하기 
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
    // Single user
    socket.emit('message', 'Welcome to ChatCord!');

    // Boradcast when a user connects 
    // all of the clients except that's connecting
     socket.broadcast.emit('message', 'A user has joined the chat');


     // Runs when client disconnects
     socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
     });

    // all the clients in general
    //io.emit()


    // Listen for chat Message
    socket.on('chatMessage', (msg)=>{
        io.emit('message', msg);
    });
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

