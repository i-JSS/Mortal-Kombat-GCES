console.log("games.js OK")

const {Pool} = require('pg');

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

var Messages = {
    EVENT: 'event',
    LIFE_UPDATE: 'life-update',
    POSITION_UPDATE: 'position-update',
    PLAYER_CONNECTED: 'player-connected'
};


function Game(id, gameCollection) {
    this._id = id;
    this._gameCollection = gameCollection;
    this._players = [];

    (async () => {
        try {
            await query('INSERT INTO games (game_name) VALUES ($1)', [this._id]);
            console.log(`[DB-Games] ${this._id} - Successfully inserted`);
        } catch (err) {
            console.error(`[DB ERROR] Falha ao inserir jogo ${this._id}:`, err.message);
        }
    })();
}


Game.prototype.getId = function () {
    return this._id;
};

Game.prototype.addPlayer = async function (p) {
    if (this._players.length > 1) {
        return false;
    }
    this._players.push(p);

    try {
        await query('INSERT INTO players (socket_id) VALUES ($1)', [p.id]);
        console.log(`[DB-Players] ${p.id} - Successfully inserted`);
    } catch (err) {
        console.error(`[DB ERROR] Falha ao inserir jogador ${p.id}:`, err.message);
    }

    if (this._players.length > 1) {
        this._addHandlers();
        this._players[0].emit(Messages.PLAYER_CONNECTED, 0);
    }
    return true;
};

Game.prototype._addHandlers = function () {
    var p1 = this._players[0],
        p2 = this._players[1],
        m = Messages,
        self = this;
    p1.on(m.EVENT, function (data) {
        p2.emit(m.EVENT, data);
    });
    p1.on(m.LIFE_UPDATE, function (data) {
        p2.emit(m.LIFE_UPDATE, data);
    });
    p1.on(m.POSITION_UPDATE, function (data) {
        p2.emit(m.POSITION_UPDATE, data);
    });
    p2.on(m.EVENT, function (data) {
        p1.emit(m.EVENT, data);
    });
    p2.on(m.LIFE_UPDATE, function (data) {
        p1.emit(m.LIFE_UPDATE, data);
    });
    p2.on(m.POSITION_UPDATE, function (data) {
        p1.emit(m.POSITION_UPDATE, data);
    });
    p1.on('disconnect', function () {
        self.endGame(0);
    });
    p2.on('disconnect', function () {
        self.endGame(1);
    });
};

Game.prototype.endGame = function (playerOut) {
    if (!this._players.length) return;
    var opponent = +!playerOut;
    opponent = this._players[opponent];
    this._players = [];
    opponent.disconnect();
    this._gameCollection.removeGame(this._id);
};


function GameCollection() {
    this._games = {};
}

GameCollection.prototype.getGame = function (game) {
    return this._games[game];
};

GameCollection.prototype.createGame = function (id) {
    if (this._games[game]) {
        return false;
    }
    var game = new Game(id, this);
    this._games[id] = game;
    return true;
};

GameCollection.prototype.removeGame = function (id) {
    if (this._games[id]) {
        delete this._games[id];
        return true;
    }
    return false;
};

exports.GameCollection = GameCollection;
exports.Game = Game;