import io from 'socket.io-client';
import Peers from 'peers';
import Sketchpad from 'sketchpad';

let sketchpad = new Sketchpad({
  canvas: document.getElementById('sketchpad'),
});

var socket = io(Environment.SIGNALLER);
var peers = new Peers({signaller: socket});

/*
 * WebRTC Events
 */

peers.on('connect', function(id) {
  console.info('connected to peer', id);
  peers.send('hon-colino-cocola');
});

peers.on('data', function(id, data) {
  console.log('received', data, 'from', id);
});

peers.on('disconnect', function(id) {
  console.info('disconnected to peer', id);
});

/*
 * WebSocket Events (Signalling Only)
 */

// Connected :)
socket.on('connect', function() {
  console.info('connected to the signal server');
  socket.emit('join', location.hash.substr(3) || 'index');
});

// Other peer joined this room
socket.on('joined', function(id) {
  peers.add(id);
});

// Received a signal from someone
socket.on('signal', function(data) {
  peers.add(data.source, data.signal);
});

// Disconnected :(
socket.on('disconnect', function() {
  console.info('disconnected to the signal server');
});
