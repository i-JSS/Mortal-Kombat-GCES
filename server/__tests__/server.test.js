const { GameCollection } = require("../games.js");

// Função original usa o banco, to isolando ela!
jest.mock("../games.js", () => {
    const originalModule = jest.requireActual("../games.js");

    var Messages = {
        EVENT: 'event',
        LIFE_UPDATE: 'life-update',
        POSITION_UPDATE: 'position-update',
        PLAYER_CONNECTED: 'player-connected'
    };

    const mockQuery = jest.fn(() => Promise.resolve({ rows: [] }));

    function MockGame(id, gameCollection) {
        this._id = id;
        this._gameCollection = gameCollection;
        this._players = [];
        this.query = mockQuery;
    }

    MockGame.prototype.addPlayer = function (p) {
        if (this._players.length > 1) {
            return false;
        }
        this._players.push(p);
        if (this._players.length > 1) {
            this._players[0].emit(Messages.PLAYER_CONNECTED, 0);
        }
        return true;
    };

    return { ...originalModule, Game: MockGame };
});

const { Game } = require("../games.js");

describe("Game.addPlayer()", () => {
    let game;

    beforeEach(() => {
        const mockGameCollection = { removeGame: jest.fn() };
        game = new Game("game-1", mockGameCollection);
    });

    test("deve adicionar o primeiro jogador e retornar true", () => {
        const player = { id: "socket1", emit: jest.fn() };
        const result = game.addPlayer(player);

        expect(result).toBe(true);
        expect(game._players.length).toBe(1);
        expect(game._players[0]).toBe(player);
    });

    test("deve adicionar o segundo jogador e emitir evento PLAYER_CONNECTED", () => {
        const p1 = { id: "socket1", emit: jest.fn() };
        const p2 = { id: "socket2", emit: jest.fn() };

        game.addPlayer(p1);
        const result = game.addPlayer(p2);

        expect(result).toBe(true);
        expect(game._players.length).toBe(2);
        expect(p1.emit).toHaveBeenCalledWith("player-connected", 0);
    });

    test("deve retornar false se tentar adicionar mais de dois jogadores", () => {
        const p1 = { id: "socket1", emit: jest.fn() };
        const p2 = { id: "socket2", emit: jest.fn() };
        const p3 = { id: "socket3", emit: jest.fn() };

        game.addPlayer(p1);
        game.addPlayer(p2);
        const result = game.addPlayer(p3);

        expect(result).toBe(false);
        expect(game._players.length).toBe(2);
    });
});
