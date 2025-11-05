var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    GameCollection = require('./games.js').GameCollection,
    games = new GameCollection();

io.set('origins', 'http://localhost:8080:*');
io.set('log level', 1);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

const { Pool } = require('pg');

const pool = new Pool({
    user: 'docker',
    host: 'postgresql',
    database: 'mkjs',
    password: 'docker',
    port: 5432,
});

async function query(text, params) {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res;
    } finally {
        client.release();
    }
}

query('INSERT INTO games (game_name) VALUES ($1) ON CONFLICT (game_id) DO NOTHING', ["TOTOLA"])
    .then(() => console.log(`[DB] Jogo ${"totola"} inserido no banco`))
    .catch(err => console.error(`[DB ERROR]`, err));


io.sockets.on('connection', function (socket) {
    console.log('Client connected! Socket ID:', socket.id);

    socket.on(Requests.CREATE_GAME, function (gameName) {
        if (games.createGame(gameName)) {
            games.getGame(gameName).addPlayer(socket);
            socket.emit('response', Responses.SUCCESS);
            console.log("CRIADO!")
            query('INSERT INTO games (game_id) VALUES ($1) ON CONFLICT (game_id) DO NOTHING', [gameName])
                .then(() => console.log(`[DB] Jogo ${gameName} inserido no banco`))
                .catch(err => console.error(`[DB ERROR]`, err));

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
