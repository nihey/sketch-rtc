var http = require('http').Server(),
    io = require('socket.io')(http);

io.on('connection', function(socket) {
  console.log(socket.id, 'connected');

  socket.on('join', function(room) {
    console.log(socket.id, 'joined', room);
    // Tell the other peers that someone joined the room
    io.to(room).emit('joined', socket.id);
    socket.join(room);
  });

  socket.on('signal', function(data) {
    io.to(data.dest).emit('signal', {
      source: socket.id,
      signal: data.signal,
    });
  });
});

http.listen(9090, function() {
  console.log('listening on *:9090');
});
