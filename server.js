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
const rooms = {};

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/:room', (req, res) => {
  if(rooms[req.params.room] != undefined) {
    res.render('room', { roomId: req.params.room});
  }
  else {
    res.render('index');
  }
})

app.post('/', (req, res) => {
  var key = shortid.generate();
  createRoom(key);
  res.render('room', { roomId: key});
})

io.on('connection', (socket) => {
  socket.on('new-user', (roomId) => {
    socket.join(roomId);
    addNewUser(roomId, socket.id);
  })

  socket.on('draw', (roomId, data) => {
    if(getRequestClientType(socket) == "W") emitRoomEvent('draw', roomId, data);
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

  socket.on('toolUpdate', (roomID, data) => {
    emitRoomEvent('toolUpdate', roomID, data);
  })

  socket.on('sending-context', (roomID, data) => {
    emitRoomEvent('sending-context', roomID, data);
  })

  socket.on('synchronize', (roomID) => {
    info('Synchronize client ' + socket.id + ' with the server');
    emitRoomEvent('request-context', roomID, rooms[roomID].writer)
  })

  socket.on('disconnect', () => {
    info('User ' + socket.id + ' disconnected');
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

function createRoom(key) {
  info("A new room with id " + key + " was created");
  rooms[key] = { users: {}, writer: "" };
}

function addNewUser(roomID, clientID) {
  var status;
  var room = rooms[roomID];
  Object.keys(room.users).length === 0 ? status = "W" : status = "R";
  if(status == "W") room.writer = clientID;
  room.users[clientID] = { status: status };
  info('Client ' + clientID + ' joined the room ' + roomID);
}

function getRequestClientType(socket) {
  return rooms[socket.rooms[Object.keys(socket.rooms)[1]]].users[socket.id].status;
}