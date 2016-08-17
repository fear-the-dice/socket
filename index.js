'use strict';

require('newrelic');

let app = require('express')();
let cors = require('cors');
let http = require('http').Server(app);
let io = require('socket.io')(http);
let _ = require('lodash');
let players = [];
let monsters = [];
let port = process.env.PORT || 1347;

app.use(cors());

io.on('connection', socket => {
    socket.emit('ExistingPlayers', JSON.stringify(players));
    socket.emit('ExistingMonsters', JSON.stringify(monsters));

    socket.on('StartTurn', msg => {
        monsters.push(msg);
        socket.broadcast.emit('StartTurn', msg);
    });

    socket.on('EndTurn', msg => {
        monsters.push(msg);
        socket.broadcast.emit('EndTurn', msg);
    });

    socket.on('NewMonster', msg => {
        msg = JSON.parse(msg);
        monsters.push(msg);
        socket.broadcast.emit('NewMonster', JSON.stringify(msg));
    });

    socket.on('NewPlayer', msg => {
        msg = JSON.parse(msg);
        players.push(msg);
        socket.broadcast.emit('NewPlayer', JSON.stringify(msg));
    });

    socket.on('MonsterRemoved', msg => {
        let rMonster = JSON.parse(msg);

        monsters = _.filter(monsters, monster =>  {
            return rMonster.id !== monster.id;
        });

        socket.broadcast.emit('MonsterRemoved', msg);
    });

    socket.on('PlayerRemoved', msg => {
        let rPlayer = JSON.parse(msg);

        players = _.filter(players, player => {
            return player.id !== rPlayer.id;
        });

        socket.broadcast.emit('PlayerRemoved', msg);
    });

    socket.on('MonsterUpdate', msg => {
        let key, nMonster, oMonster;

        nMonster = JSON.parse(msg);

        oMonster = _.find(monsters, monster =>  {
            return monster.id === nMonster.id;
        });

        if (typeof oMonster !== 'undefined') {
            for (key in nMonster) {
                oMonster[key] = nMonster[key];
            }
        }

        socket.broadcast.emit('MonsterUpdate', msg);
    });

    socket.on('PlayerUpdate', msg => {
        let key, nPlayer, oPlayer;

        nPlayer = JSON.parse(msg);

        oPlayer = _.find(players, player => {
            return player.id === nPlayer.id;
        });

        if(typeof oPlayer !== 'undefined') {
            for (key in nPlayer) {
                oPlayer[key] = nPlayer[key];
            }
        }

        socket.broadcast.emit('PlayerUpdate', msg);
    });
});

http.listen(port, () => {
    console.log('listening on *:'+port);
});
