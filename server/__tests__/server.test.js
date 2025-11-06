jest.mock("pg", () => {
    const mClient = { query: jest.fn(), release: jest.fn() };
    const mPool = { connect: jest.fn(() => mClient) };
    return { Pool: jest.fn(() => mPool) };
});

jest.mock("../games.js", () => {
    const original = jest.requireActual("../games.js");
    return {
        ...original,
        __esModule: true,
        query: jest.fn(() => Promise.resolve({})),
    };
});

const { Game, query } = require("../games.js");

describe("Game class", () => {
    let game;

    beforeEach(() => {
        jest.clearAllMocks();
        const gameCollection = { removeGame: jest.fn() };
        game = new Game("test-game", gameCollection);
    });

    test("getId deve retornar o identificador único do jogo", () => {
        expect(game.getId()).toBe("test-game");
    });

    test("addPlayer deve adicionar um segundo jogador e notificar o primeiro com PLAYER_CONNECTED", async () => {
        const p1 = { id: "socket1", emit: jest.fn(), on: jest.fn() };
        const p2 = { id: "socket2", emit: jest.fn(), on: jest.fn() };
        await game.addPlayer(p1);
        const result = await game.addPlayer(p2);
        expect(result).toBe(true);
        expect(game._players).toHaveLength(2);
        expect(p1.emit).toHaveBeenCalledWith("player-connected", 0);
    });

    test("addPlayer deve adicionar o jogador mesmo que a inserção no banco de dados falhe", async () => {
        query.mockImplementationOnce(() => Promise.reject(new Error("DB fail")));
        const player = { id: "socket1", emit: jest.fn() };
        const result = await game.addPlayer(player);
        expect(result).toBe(true);
        expect(game._players).toHaveLength(1);
    });
});
