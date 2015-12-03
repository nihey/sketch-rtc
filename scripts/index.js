import io from 'socket.io-client';
import Peers from 'peers';
import Pointer from 'pointer';
import Sketchpad from 'sketchpad';

let canvas = document.getElementById('sketchpad');
let sketchpad = new Sketchpad({
  canvas,
});

var socket = io(Environment.SIGNALLER);
var peers = new Peers({signaller: socket});
var pointers = {};

let getCursor = function(event) {
  return {
    x: event.pageX - canvas.offsetLeft,
    y: event.pageY - canvas.offsetTop,
  };
}

let onMouseMove = function(event) {
  peers.send({
    type: 'move',
    cursor: getCursor(event),
  });
};

canvas.addEventListener('mousemove', onMouseMove)
sketchpad.on('sketching', function(isSketching) {
 // Only send mouse location data when the user is not sketching
 isSketching || canvas.addEventListener('mousemove', onMouseMove);
 isSketching && canvas.removeEventListener('mousemove', onMouseMove);
});

/*
 * Sketchpad events
 */

sketchpad.on('stroke', function(args) {
  peers.send({
    type: 'method',
    method: 'stroke',
    args,
  });
});

/*
 * WebRTC Events
 */

peers.on('connect', function(id) {
  console.info('connected to peer', id);
  pointers[id] = new Pointer(id);
});

peers.on('data', function(id, data) {
  if (data.type === 'method') {
    data.args = data.args || []
    sketchpad[data.method](...data.args);
  } else if (data.type === 'move') {
    let args = [data.cursor.x + canvas.offsetLeft, data.cursor.y + canvas.offsetTop];
    pointers[id].moveTo(...args);
  }
});

peers.on('disconnect', function(id) {
  console.info('disconnected to peer', id);
  pointers[id].remove();
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
