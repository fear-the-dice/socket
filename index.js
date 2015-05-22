var app = require('express')();
var cors = require('cors');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');
var players = [];
var monsters = [];
var port = process.env.SOCKET_PORT || 1347;

app.use(cors());

io.on('connection', function(socket){
  socket.emit('ExistingPlayers', JSON.stringify(players));
  socket.emit('ExistingMonsters', JSON.stringify(monsters));

  socket.on('StartTurn', function(msg){
    monsters.push(JSON.parse(msg));
    socket.broadcast.emit('StartTurn', msg);
  });

  socket.on('EndTurn', function(msg){
    monsters.push(JSON.parse(msg));
    socket.broadcast.emit('EndTurn', msg);
  });

  socket.on('NewMonster', function(msg){
    monsters.push(JSON.parse(msg));
    socket.broadcast.emit('NewMonster', msg);
  });

  socket.on('NewPlayer', function(msg){
    players.push(JSON.parse(msg));
    socket.broadcast.emit('NewPlayer', msg);
  });

  socket.on('MonsterRemoved', function(msg){
    rMonster = JSON.parse(msg);

    monsters = _.filter(monsters, function (monster) {
      return rMonster.id !== rMonster.id;
    });

    socket.broadcast.emit('MonsterRemoved', msg);
  });

  socket.on('PlayerRemoved', function(msg){
    rPlayer = JSON.parse(msg);

    players = _.filter(players, function (player) {
      return player.id !== rPlayer.id;
    });

    socket.broadcast.emit('PlayerRemoved', msg);
  });

  socket.on('MonsterUpdate', function(msg){
    var nMonster = JSON.parse(msg);

    var oMonster = _.find(monsters, function(monster) {
      return monster.id === nMonster.id;
    });

    if(typeof(oMonster) !== 'undefined') {
      oMonster.monster = nMonster.monster;
      oMonster.initiative = nMonster.initiative;
      oMonster.hp = nMonster.hp;
      oMonster.health = nMonster.health;
      oMonster.ac = nMonster.ac;
      oMonster.damage = nMonster.damage;
    }

    socket.broadcast.emit('MonsterUpdate', msg);
  });

  socket.on('PlayerUpdate', function(msg){
    var nPlayer = JSON.parse(msg);

    var oPlayer = _.find(players, function(player) {
      return player.id === nPlayer.id;
    });

    if(typeof(oPlayer) !== 'undefined') {
      oPlayer.character = nPlayer.character;
      oPlayer.name = nPlayer.name;
      oPlayer.initiative = nPlayer.initiative;
      oPlayer.hp = nPlayer.hp;
      oPlayer.health = nPlayer.health;
      oPlayer.ac = nPlayer.ac;
      oPlayer.damage = nPlayer.damage;
    }

    socket.broadcast.emit('PlayerUpdate', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});
