require('newrelic');
var app = require('express')();
var cors = require('cors');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');
var players = [];
var monsters = [];
var port = process.env.PORT || 1347;

app.use(cors());

io.on('connection', function(socket){
  socket.on('Join', function(id, msg){
    socket.emit('ExistingPlayers', JSON.stringify(players));
    socket.emit('ExistingMonsters', JSON.stringify(monsters));
  });

  socket.on('StartTurn', function(id, msg){
    monsters.push(JSON.parse(msg));
    socket.broadcast.to(id).emit('StartTurn', msg);
  });

  socket.on('EndTurn', function(id, msg){
    monsters.push(JSON.parse(msg));
    socket.broadcast.to(id).emit('EndTurn', msg);
  });

  socket.on('NewMonster', function(id, msg){
    monsters.push(JSON.parse(msg));
    socket.broadcast.to(id).emit('NewMonster', msg);
  });

  socket.on('NewPlayer', function(id, msg){
    players.push(JSON.parse(msg));
    socket.broadcast.to(id).emit('NewPlayer', msg);
  });

  socket.on('MonsterRemoved', function(id, msg){
    rMonster = JSON.parse(msg);

    monsters = _.filter(monsters, function (monster) {
      return rMonster.id !== rMonster.id;
    });

    socket.broadcast.to(id).emit('MonsterRemoved', msg);
  });

  socket.on('PlayerRemoved', function(id, msg){
    rPlayer = JSON.parse(msg);

    players = _.filter(players, function (player) {
      return player.id !== rPlayer.id;
    });

    socket.broadcast.to(id).emit('PlayerRemoved', msg);
  });

  socket.on('MonsterUpdate', function(id, msg){
    var nMonster = JSON.parse(msg);

    var oMonster = _.find(monsters, function(monster) {
      return monster.id === nMonster.id;
    });

    if(typeof(oMonster) !== 'undefined') {
      for(var key in nMonster){
        oMonster[key] = nMonster[key];
      }
    }

    socket.broadcast.to(id).emit('MonsterUpdate', msg);
  });

  socket.on('PlayerUpdate', function(id, msg){
    var nPlayer = JSON.parse(msg);

    var oPlayer = _.find(players, function(player) {
      return player.id === nPlayer.id;
    });

    if(typeof(oPlayer) !== 'undefined') {
      for(var key in nPlayer){
        oPlayer[key] = nPlayer[key];
      }
    }

    socket.broadcast.to(id).emit('PlayerUpdate', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});
