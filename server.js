const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const crypto = require('crypto'); // Used to generate a random room ID
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (e.g., JavaScript for the frontend)
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Render the main page
app.get('/', (req, res) => {
    res.render('index');
});

// Route to create a new room ID
app.get('/create-room', (req, res) => {
    const roomId = crypto.randomBytes(4).toString('hex'); // Generate a random 8-character room ID
    res.json({ roomId }); // Send the room ID back as JSON
});

// WebSocket for signaling in WebRTC
io.on('connection', socket => {
    console.log('a user connected');
    
    socket.on('join-room', (roomId, userId, username) => {
        socket.join(roomId);
        console.log(`${username} with user ID ${userId} joined room ${roomId}`);
        socket.to(roomId).emit('user-connected', { userId, username });
    });

    socket.on('offer', (offer, roomId) => {
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (answer, roomId) => {
        socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate, roomId) => {
        socket.to(roomId).emit('ice-candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
