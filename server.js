const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Simple route to ensure the server is running
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io communication for signaling
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Forward signal to another user
    socket.on('offer', (offer, to) => {
        socket.to(to).emit('offer', offer, socket.id);
    });

    socket.on('answer', (answer, to) => {
        socket.to(to).emit('answer', answer);
    });

    socket.on('candidate', (candidate, to) => {
        socket.to(to).emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
