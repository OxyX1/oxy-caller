const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (e.g., JavaScript for the frontend)
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Render the main page
app.get('/', (req, res) => {
    res.render('index');  // Serve the call page
});

// WebSocket for signaling in WebRTC
io.on('connection', socket => {
    console.log('a user connected');

    // Handle user joining a room (for video calls)
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId); // Notify others about new connection
    });

    // Handle receiving an offer
    socket.on('offer', (offer, roomId) => {
        socket.to(roomId).emit('offer', offer);
    });

    // Handle receiving an answer
    socket.on('answer', (answer, roomId) => {
        socket.to(roomId).emit('answer', answer);
    });

    // Handle receiving ICE candidates
    socket.on('ice-candidate', (candidate, roomId) => {
        socket.to(roomId).emit('ice-candidate', candidate);
    });

    // Handle disconnects
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
