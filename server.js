const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const shortid = require('shortid');
const chalk = require('chalk');

const DEBUG = false;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

const listeningPort = 3000;

const rooms = {}

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/:room', (req, res) => {
  if(rooms[req.params.room] != undefined) {
    res.render('room', { roomId: req.params.room});
  }
  else {
    //Maybe we can create a room instead
    res.render('index');
  }
})

app.post('/', (req, res) => {
  var key = shortid.generate();
  info("Room " + key + " was created");
  rooms[key] = { users: {}, writer: "" };
  res.render('room', { roomId: key});
})

io.on('connection', (socket) => {
  socket.on('new-user', (roomId) => {
    socket.join(roomId);
    var status;
    var room = rooms[roomId];
    Object.keys(room.users).length === 0 ? status = "W" : status = "R";
    if(status == "W"){
      room.writer = socket.id;
    }
    room.users[socket.id] = { status: status };
    info('Client ' + socket.id + ' joined the room ' + roomId);
  })

  socket.on('draw', (roomId, data) => {
    if(rooms[roomId].users[socket.id].status == "W") {
      emitRoomEvent('draw', roomId, data);
    }
  })

  socket.on('changePenSize', (penSize, roomID) => {
    emitRoomEvent('changePenSize', roomID, penSize);
  })

  socket.on('changePenColor', (penColor, roomID) => {
    emitRoomEvent('changePenColor', roomID, penColor);
  })

  socket.on('changeTool', (tool, roomID) => {
    emitRoomEvent('changeTool', roomID, tool);
  })

  socket.on('context-sending', (roomID, data) => {
    io.to(roomID).emit('context-sending', data);
  })

  socket.on('synchronize', (roomID) => {
    info('Synchronize client ' + socket.id + ' with the server');
    io.to(roomID).emit('request-context', rooms[roomID].writer);
  })

  socket.on('disconnect', () => {
    info('User disconnected');
  })
});

http.listen(listeningPort, () => {
  info('Running Collaboard App');
  info('Listening Port : ' + listeningPort);
})

function emitRoomEvent(eventTag, roomID, data) {
  io.to(roomID).emit(eventTag, data);
}

function info(msg) {
  console.log(chalk.cyan.bold('Info - ') + msg);
}

function debug(msg) {
  if (DEBUG) console.log(chalk.gray.bold('Debug - ') + msg);
}