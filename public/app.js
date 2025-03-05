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
const startButton = document.getElementById('start-call');
const endButton = document.getElementById('end-call');
const statusMessage = document.getElementById('status-message');
const codeInput = document.getElementById('code');

let callInProgress = false;
let callId = null;

startButton.disabled = false;
endButton.disabled = true;

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;
    })
    .catch(err => console.error('Error accessing media devices.', err));

function startCall() {
    const code = codeInput.value.trim();
    if (code.length === 4) {
        statusMessage.textContent = `Calling... (Code: ${code})`;
        startButton.disabled = true;
        endButton.disabled = false;

        callId = code;

        peerConnection = new RTCPeerConnection(iceServers);

        // Add local stream to peer connection
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.ontrack = (event) => {
            remoteStream = event.streams[0];
            remoteVideo.srcObject = remoteStream;
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('candidate', event.candidate, callId);
            }
        };

        peerConnection.createOffer()
            .then(offer => {
                return peerConnection.setLocalDescription(offer);
            })
            .then(() => {
                socket.emit('offer', peerConnection.localDescription, callId);
            })
            .catch(err => console.error('Error during offer creation:', err));
    } else {
        alert('Please enter a valid 4-digit code.');
    }
}

function endCall() {
    statusMessage.textContent = 'Call ended!';
    startButton.disabled = false;
    endButton.disabled = true;

    peerConnection.close();
    peerConnection = null;

    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
    remoteStream = null;
    remoteVideo.srcObject = null;
}

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
