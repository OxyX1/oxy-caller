const socket = io();
let localStream;
let remoteStream;
let peerConnection;
const iceServers = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302' // Google's public STUN server
        }
    ]
};

const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const createButton = document.getElementById('create-call');
const joinButton = document.getElementById('join-call');
const endButton = document.getElementById('end-call');
const statusMessage = document.getElementById('status-message');
const codeInput = document.getElementById('code');

let callInProgress = false;
let callId = null;

createButton.disabled = false;
joinButton.disabled = false;
endButton.disabled = true;

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;
    })
    .catch(err => console.error('Error accessing media devices.', err));

function createCall() {
    socket.emit('create-call');
    statusMessage.textContent = 'Creating call...';

    createButton.disabled = true;
    joinButton.disabled = true;
    endButton.disabled = false;
}

function joinCall() {
    const code = codeInput.value.trim();
    if (code.length === 4) {
        socket.emit('join-call', code);
        statusMessage.textContent = `Joining call with ID: ${code}`;
        createButton.disabled = true;
        joinButton.disabled = true;
        endButton.disabled = false;
    } else {
        alert('Please enter a valid 4-digit code.');
    }
}

function endCall() {
    statusMessage.textContent = 'Call ended!';
    createButton.disabled = false;
    joinButton.disabled = false;
    endButton.disabled = true;

    peerConnection.close();
    peerConnection = null;

    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
    remoteStream = null;
    remoteVideo.srcObject = null;
}

socket.on('call-created', (generatedCallId) => {
    callId = generatedCallId;
    statusMessage.textContent = `Call created! Use code: ${callId}`;
    codeInput.value = callId;
});

socket.on('joined-call', (joinedCallId) => {
    statusMessage.textContent = `Joined call with ID: ${joinedCallId}`;
});

socket.on('call-not-found', () => {
    alert('Call ID not found. Please check the code.');
});

socket.on('user-joined', (joinerId) => {
    statusMessage.textContent = 'A user has joined the call!';
});

socket.on('offer', (offer, from) => {
    if (!peerConnection) {
        peerConnection = new RTCPeerConnection(iceServers);

        peerConnection.ontrack = (event) => {
            remoteStream = event.streams[0];
            remoteVideo.srcObject = remoteStream;
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('candidate', event.candidate, from);
            }
        };

        peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
            .then(() => {
                return peerConnection.createAnswer();
            })
            .then(answer => {
                return peerConnection.setLocalDescription(answer);
            })
            .then(() => {
                socket.emit('answer', peerConnection.localDescription, from);
            })
            .catch(err => console.error('Error handling offer:', err));
    }
});

socket.on('answer', (answer) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
        .catch(err => console.error('Error setting remote description:', err));
});

socket.on('candidate', (candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(err => console.error('Error adding ICE candidate:', err));
});
