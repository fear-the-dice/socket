var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://127.0.0.1:1347';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var monster = {
  "id": "b8c2a999-e892-0964-a0f4-e36db31d2307",
  "monster": "Bugbear Chief",
  "initiative": 15,
  "ac": 27,
  "hp": 65,
  "health": 65,
  "speed": 30,
  "damage": 0,
  "challange": 2,
  "xp": 450,
  "manual": 33
};

var player = {
  "id": "779ed185-860e-a7a8-1f11-2d6ea1d073df",
  "name": "Robin",
  "character": "Strife",
  "initiative": 18,
  "ac": 16,
  "hp": 19,
  "health": 19,
  "speed": 25,
  "damage": 0
};

describe("Chat Server",function(){
  it('Broadcast a list of existing monsters and players to the new user', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('ExistingMonsters', function(data){
      data.should.equal([]);
    });

    client1.on('ExistingPlayers', function(data){
      data.should.equal([]);
    });

    client1.emit("NewPlayer", player);
    client1.emit("NewMonster", monster);

    var client2 = io.connect(socketURL, options);

    client2.on('ExistingMonsters', function(data){
      data.should.equal([monster]);
    });

    client2.on('ExistingPlayers', function(data){
      data.should.equal([player]);
    });

    done();
  });
});
