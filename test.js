'use strict';

let assert    = require('assert');
let io        = require('socket.io-client');
let socketURL = 'http://127.0.0.1:1347';

require('should');
require('./index.js');


let options = {
    transports: ['websocket'],
    'force new connection': true
};

let monster = {
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

let player = {
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

describe("Socket Server",() => {
    it('Broadcast an empty list of existing monsters.', done => {
        let tests, client, messages;

        tests = 1;
        messages = 0;
        client = io.connect(socketURL, options);

        client.on('ExistingMonsters', data => {
            messages++;
            assert.equal(data, '[]');
            client.emit("NewMonster", JSON.stringify(monster));
        });

        setTimeout(() => {
            messages.should.equal(tests);
            client.disconnect();
            done();
        }, 40);

    });

    it('Broadcast an empty list of existing players.', done => {
        let clients, messages;

        messages = 0;
        clients = [];

        clients.push(io.connect(socketURL, options));

        clients[0].on('ExistingPlayers', data => {
            messages++;
            assert.equal(data, '[]');
            clients[0].emit("NewPlayer", JSON.stringify(player));
        });

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast a list of existing monsters to the new user.', done => {
        let clients, messages;

        messages = 0;
        clients = [];

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('ExistingMonsters', data => {
            messages++;
            data.should.equal(JSON.stringify([monster]));
        });

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast a list of existing monsters to the new user.', done => {
        let clients, messages;

        messages = 0;
        clients = [];

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('ExistingPlayers', data => {
            messages++;
            data.should.equal(JSON.stringify([player]));
        });

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast when a player is removed', done => {
        let clients, messages;

        messages = 0;
        clients = [];

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('PlayerRemoved', data => {
            messages++;
            data.should.equal(JSON.stringify(player));
        });

        clients[0].emit("PlayerRemoved", JSON.stringify(player));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast when a player or monster is removed', done => {
        let clients, messages;

        messages = 0;
        clients = [];

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('MonsterRemoved', data => {
            messages++;
            data.should.equal(JSON.stringify(monster));
        });

        clients[0].emit("MonsterRemoved", JSON.stringify(monster));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast new monsters to all connected', done => {
        let clients, messages;

        clients = [];
        messages = 0;

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('NewMonster', data => {
            messages++;
            data.should.equal(JSON.stringify(monster));
        });

        clients[0].emit("NewMonster", JSON.stringify(monster));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast new players to all connected', function(done){
        let clients, messages;

        clients = [];
        messages = 0;

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('NewPlayer', function(data){
            messages++;
            data.should.equal(JSON.stringify(player));
        });

        clients[0].emit("NewPlayer", JSON.stringify(player));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast the player when their turn stars', function(done){
        let clients, messages;

        clients = [];
        messages = 0;

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('StartTurn', function(data){
            messages++;
            data.should.equal(JSON.stringify(player));
        });

        clients[0].emit("StartTurn", JSON.stringify(player));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast the player when their turn ends', function(done){
        let clients, messages;

        clients = [];
        messages = 0;

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('EndTurn', function(data){
            messages++;
            data.should.equal(JSON.stringify(player));
        });

        clients[0].emit("EndTurn", JSON.stringify(player));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast the player on change', done => {
        let clients, messages;

        clients = [];
        messages = 0;

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('PlayerUpdate', data => {
            messages++;
            data.should.equal(JSON.stringify(player));
        });

        clients[0].emit("PlayerUpdate", JSON.stringify(player));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast the monster on change', done => {
        let clients, messages;

        clients = [];
        messages = 0;

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('MonsterUpdate', data => {
            messages++;
            data.should.equal(JSON.stringify(monster));
        });

        clients[0].emit("MonsterUpdate", JSON.stringify(monster));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast new players to all connected', done => {
        let clients, messages;

        clients = [];
        messages = 0;

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('NewPlayer', function(data){
            messages++;
            data.should.equal(JSON.stringify(player));
        });

        clients[0].emit("NewPlayer", JSON.stringify(player));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast new monsters to all connected', done => {
        let clients, messages;

        clients = [];
        messages = 0;

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('NewMonster', function(data){
            messages++;
            data.should.equal(JSON.stringify(monster));
        });

        clients[0].emit("NewMonster", JSON.stringify(monster));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast the player when their turn stars', done => {
        let clients, messages;

        clients = [];
        messages = 0;

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('StartTurn', function(data){
            messages++;
            data.should.equal(JSON.stringify(player));
        });

        clients[0].emit("NewPlayer", JSON.stringify(player));
        clients[0].emit("StartTurn", JSON.stringify(player));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast the player when their turn ends', done => {
        let clients, messages;

        clients = [];
        messages = 0;

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('EndTurn', function(data){
            messages++;
            data.should.equal(JSON.stringify(player));
        });

        clients[0].emit("NewPlayer", JSON.stringify(player));
        clients[0].emit("StartTurn", JSON.stringify(player));
        clients[0].emit("EndTurn", JSON.stringify(player));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast when a player is removed', function(done){
        let clients, messages;

        clients = [];
        messages = 0;

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[1].on('PlayerRemoved', function(data){
            messages++;
            data.should.equal(JSON.stringify(player));
        });

        clients[0].emit("NewPlayer", JSON.stringify(player));
        clients[0].emit("PlayerRemoved", JSON.stringify(player));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });

    it('Broadcast when a monster is removed', function(done){
        let clients, messages;

        clients = [];
        messages = 0;

        clients.push(io.connect(socketURL, options));
        clients.push(io.connect(socketURL, options));

        clients[0].on('MonsterRemoved', function(data){
            messages++;
            data.should.equal(JSON.stringify(monster));
        });

        clients[1].emit("NewMonster", JSON.stringify(monster));
        clients[1].emit("MonsterRemoved", JSON.stringify(monster));

        setTimeout(() => {
            messages.should.equal(1);
            clients.map(client => { client.disconnect(); });
            done();
        }, 40);
    });
});
