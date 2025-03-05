const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

// Store ongoing calls by ID
let calls = {};

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Simple route to ensure the server is running
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Generate a unique 4-digit code
function generateCallId() {
    let code;
    do {
        code = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit number
    } while (calls[code]); // Ensure the code isn't already used
    return code;
}

// Socket.io communication for signaling
io.on('connection', (socket) => {
    console.log('A user connected');

    // When a user creates a call
    socket.on('create-call', () => {
        const callId = generateCallId();
        calls[callId] = { host: socket.id };
        console.log(`Call created with ID: ${callId}`);
        socket.emit('call-created', callId); // Send the generated call ID back to the client
    });

    // When a user joins a call
    socket.on('join-call', (callId) => {
        if (calls[callId]) {
            const call = calls[callId];
            call.joiner = socket.id;
            console.log(`User joined call with ID: ${callId}`);

            // Notify the host that a user has joined
            io.to(call.host).emit('user-joined', socket.id);

            socket.emit('joined-call', callId); // Confirm join to the user
        } else {
            socket.emit('call-not-found');
        }
    });

    // Forward offer from host to joiner
    socket.on('offer', (offer, to) => {
        socket.to(to).emit('offer', offer, socket.id);
    });

    // Forward answer from joiner to host
    socket.on('answer', (answer, to) => {
        socket.to(to).emit('answer', answer);
    });

    // Forward ICE candidates between users
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
