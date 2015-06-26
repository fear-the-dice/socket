var assert = require('assert');
var should = require('should');
var io = require('socket.io-client');
var server = require('./index.js');

var socketURL = 'http://127.0.0.1:1347';
var client1, client2;
var messages = 0;

var options = {
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

describe("Socket Server",function(){
  it('Broadcast an empty list of existing monsters and players.', function(done){
    var tests = 2;
    var completeTest = function(){
      messages.should.equal(tests);
      done();
      client1.disconnect();
      client2.disconnect();
    };

    client1 = io.connect(socketURL, options);
    client2 = io.connect(socketURL, options);

    client1.on('ExistingPlayers', function(data){
      messages++;
      assert.equal(data, '[]');

      client1.emit("NewPlayer", JSON.stringify(player));
    });

    client1.on('ExistingMonsters', function(data){
      messages++;
      assert.equal(data, '[]');
      client1.emit("NewMonster", JSON.stringify(monster));
    });

    setTimeout(completeTest, 40);
  });

  it('Broadcast a list of existing monsters and players to the new user', function(done){
    messages = 0;
    var tests = 2;
    var completeTest = function(){
      messages.should.equal(tests);
      done();
      client1.disconnect();
      client2.disconnect();
    };

    client1 = io.connect(socketURL, options);
    client2 = io.connect(socketURL, options);

    client2.on('ExistingMonsters', function(data){
      messages++;
      data.should.equal(JSON.stringify([monster]));
    });

    client2.on('ExistingPlayers', function(data){
      messages++;
      data.should.equal(JSON.stringify([player]));
    });

    setTimeout(completeTest, 40);
  });

  it('Broadcast when a player or monster is removed', function(done){
    messages = 0;
    var tests = 2;
    var completeTest = function(){
      messages.should.equal(tests);
      done();
      client1.disconnect();
      client2.disconnect();
    };

    client1 = io.connect(socketURL, options);
    client2 = io.connect(socketURL, options);

    client1.on('MonsterRemoved', function(data){
      messages++;
      data.should.equal(JSON.stringify(monster));
    });

    client1.on('PlayerRemoved', function(data){
      messages++;
      data.should.equal(JSON.stringify(player));
    });

    client2.emit("PlayerRemoved", JSON.stringify(player));
    client2.emit("MonsterRemoved", JSON.stringify(monster));

    setTimeout(completeTest, 40);
  });

  it('Broadcast new monsters and new players to all connected', function(done){
    messages = 0;
    var tests = 2;
    var completeTest = function(){
      messages.should.equal(tests);
      done();
      client1.disconnect();
      client2.disconnect();
    };

    client1 = io.connect(socketURL, options);
    client2 = io.connect(socketURL, options);

    client2.on('NewMonster', function(data){
      messages++;
      data.should.equal(JSON.stringify(monster));
    });

    client2.on('NewPlayer', function(data){
      messages++;
      data.should.equal(JSON.stringify(player));
    });

    client1.emit("NewPlayer", JSON.stringify(player));
    client1.emit("NewMonster", JSON.stringify(monster));

    setTimeout(completeTest, 40);
  });

  it('Broadcast the player when their turn stars and ends', function(done){
    messages = 0;
    var tests = 2;
    var completeTest = function(){
      messages.should.equal(tests);
      done();
      client1.disconnect();
      client2.disconnect();
    };

    client1 = io.connect(socketURL, options);
    client2 = io.connect(socketURL, options);

    client2.on('StartTurn', function(data){
      messages++;
      data.should.equal(JSON.stringify(player));
    });

    client2.on('EndTurn', function(data){
      messages++;
      data.should.equal(JSON.stringify(player));
    });

    client1.emit("StartTurn", JSON.stringify(player));
    client1.emit("EndTurn", JSON.stringify(player));

    setTimeout(completeTest, 40);
  });

  it('Broadcast the player and monster on change', function(done){
    messages = 0;
    var tests = 2;
    var completeTest = function(){
      messages.should.equal(tests);
      done();
      client1.disconnect();
      client2.disconnect();
    };

    client1 = io.connect(socketURL, options);
    client2 = io.connect(socketURL, options);

    client2.on('PlayerUpdate', function(data){
      messages++;
      data.should.equal(JSON.stringify(player));
    });

    client2.on('MonsterUpdate', function(data){
      messages++;
      data.should.equal(JSON.stringify(monster));
    });

    client1.emit("PlayerUpdate", JSON.stringify(player));
    client1.emit("MonsterUpdate", JSON.stringify(monster));

    setTimeout(completeTest, 40);
  });
});

describe("Socket Server",function(){
  it('Broadcast new monsters and new players to all connected', function(done){
    var client1 = io.connect(socketURL, options);
    var client2 = io.connect(socketURL, options);

    client1.emit("NewPlayer", player);
    client1.emit("NewMonster", monster);


    client2.on('NewMonster', function(data){
      data.should.equal(monster);
    });

    client2.on('NewPlayer', function(data){
      data.should.equal(player);
    });

    done();
  });
});

describe("Socket Server",function(){
  it('Broadcast the player when their turn stars and ends', function(done){
    var client1 = io.connect(socketURL, options);

    client1.emit("NewPlayer", player);

    var client2 = io.connect(socketURL, options);

    client1.emit("StartTurn", player);
    client2.on('StartTurn', function(data){
      data.should.equal(player);
    });

    client1.emit("EndTurn", player);
    client2.on('EndTurn', function(data){
      data.should.equal(player);
    });

    done();
  });
});

describe("Socket Server",function(){
  it('Broadcast when a player or monster is removed', function(done){
    var client1 = io.connect(socketURL, options);
    var client2 = io.connect(socketURL, options);

    client1.emit("NewPlayer", player);
    client2.emit("NewMonster", monster);

    client1.emit("PlayerRemoved", player);
    client2.emit("MonsterRemoved", monster);

    client1.on('MonsterRemoved', function(data){
      data.should.equal(monster);
    });

    client2.on('PlayerRemoved', function(data){
      data.should.equal(player);
    });
    done();
  });
});
