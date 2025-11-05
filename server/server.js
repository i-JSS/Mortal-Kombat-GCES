console.log("server.js OK")

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    GameCollection = require('./games.js').GameCollection,
    games = new GameCollection();

io.set('origins', 'http://127.0.0.1:8080 http://localhost:8080:*');
io.set('log level', 1);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    next();
});

server.listen(55555);

var Responses = {
    SUCCESS: 0,
    GAME_EXISTS: 1,
    GAME_NOT_EXISTS: 2,
    GAME_FULL: 3
};

var Requests = {
    CREATE_GAME: 'create-game',
    JOIN_GAME: 'join-game'
};

io.sockets.on('connection', function (socket) {
    console.log('Client connected! Socket ID:', socket.id);

    socket.on(Requests.CREATE_GAME, function (gameName) {
        if (games.createGame(gameName)) {
            games.getGame(gameName).addPlayer(socket);
            socket.emit('response', Responses.SUCCESS);
        } else {
            socket.emit('response', Responses.GAME_EXISTS);
        }
    });

    socket.on(Requests.JOIN_GAME, function (gameName) {
        var game = games.getGame(gameName);
        if (!game) {
            socket.emit('response', Responses.GAME_NOT_EXISTS);
        } else {
            if (game.addPlayer(socket)) {
                socket.emit('response', Responses.SUCCESS);
            } else {
                socket.emit('response', Responses.GAME_FULL);
            }
        }
    });
});
