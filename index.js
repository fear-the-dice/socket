var app = require('express')();
var cors = require('cors');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');
var rooms = [];
var port = process.env.PORT || 1347;

app.use(cors());

io.on('connection', function(socket){
  socket.on('Join', function(msg){
    console.log("socket joining %s", msg);
    if (msg === null) {
      msg = "default";
    }

    socket.join(msg);
    socket.room = msg;
    var roomObj = rooms[socket.room];

    if (typeof roomObj === 'undefined') {
      rooms[socket.room] = {
        players: [],
        monsters: []
      };

      roomObj = rooms[socket.room];
    }

    socket.emit('ExistingPlayers', JSON.stringify(roomObj.players));
    socket.emit('ExistingMonsters', JSON.stringify(roomObj.monsters));
  });

  socket.on('StartTurn', function(msg){
    var roomObj = rooms[socket.room];
    roomObj.monsters.push(JSON.parse(msg));
    socket.broadcast.to(socket.room).emit('StartTurn', msg);
  });

  socket.on('EndTurn', function(msg){
    var roomObj = rooms[socket.room];
    roomObj.monsters.push(JSON.parse(msg));
    socket.broadcast.to(socket.room).emit('EndTurn', msg);
  });

  socket.on('NewMonster', function(msg){
    var roomObj = rooms[socket.room];
    roomObj.monsters.push(JSON.parse(msg));
    socket.broadcast.to(socket.room).emit('NewMonster', msg);
  });

  socket.on('NewPlayer', function(msg){
    var roomObj = rooms[socket.room];
    roomObj.players.push(JSON.parse(msg));
    socket.broadcast.to(socket.room).emit('NewPlayer', msg);
  });

  socket.on('MonsterRemoved', function(msg){
    var roomObj = rooms[socket.room];
    rMonster = JSON.parse(msg);

    roomObj.monsters = _.filter(roomObj.monsters, function (monster) {
      return rMonster.id !== rMonster.id;
    });

    socket.broadcast.to(socket.room).emit('MonsterRemoved', msg);
  });

  socket.on('PlayerRemoved', function(msg){
    var roomObj = rooms[socket.room];
    rPlayer = JSON.parse(msg);

    roomObj.players = _.filter(roomObj.players, function (player) {
      return player.id !== rPlayer.id;
    });

    socket.broadcast.to(socket.room).emit('PlayerRemoved', msg);
  });

  socket.on('MonsterUpdate', function(msg){
    var roomObj = rooms[socket.room];
    var nMonster = JSON.parse(msg);

    var oMonster = _.find(roomObj.monsters, function(monster) {
      return monster.id === nMonster.id;
    });

    if(typeof(oMonster) !== 'undefined') {
      for(var key in nMonster){
        oMonster[key] = nMonster[key];
      }
    }

    socket.broadcast.to(socket.room).emit('MonsterUpdate', msg);
  });

  socket.on('PlayerUpdate', function(msg){
    var roomObj = rooms[socket.room];
    var nPlayer = JSON.parse(msg);

    var oPlayer = _.find(roomObj.players, function(player) {
      return player.id === nPlayer.id;
    });

    if(typeof(oPlayer) !== 'undefined') {
      for(var key in nPlayer){
        oPlayer[key] = nPlayer[key];
      }
    }

    socket.broadcast.to(socket.room).emit('PlayerUpdate', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});
