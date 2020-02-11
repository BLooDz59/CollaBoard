const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const uuid = require('uuid');
const chalk = require('chalk');

app.set('views', './views');
app.set('view engine', 'ejs');

const rooms = {}

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room});
})

app.post('/create', (req, res) => {
  var key = uuid.v4();
  info("Room " + key + " created");
  rooms[key] = { users: {} };
  res.redirect(key);
})

io.on('connection', (socket) => {
  socket.on('new-user', (roomId) => {
    socket.join(roomId);
    var status;
    Object.keys(rooms[roomId].users).length === 0 ? status = "W" : status = "R";
    rooms[roomId].users[socket.id] = { status: status};
  })

  socket.on('draw', (roomId, data) => {
    if(rooms[roomId].users[socket.id].status == "W") {
      io.to(roomId).emit('draw', data);
    }
  })
  socket.on('disconnect', () => {
    info('User disconnected');
  })
});

http.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})

function info(msg) {
  console.log(chalk.cyan.bold('Info - ') + msg);
}

function debug(msg) {
  console.log(chalk.gray.bold('Debug - ') + msg);
}