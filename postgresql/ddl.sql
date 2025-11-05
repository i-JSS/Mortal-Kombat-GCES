CREATE TABLE IF NOT EXISTS games (
    game_id SERIAL PRIMARY KEY,
    game_name TEXT NOT NULL,
    game_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
    player_id SERIAL PRIMARY KEY,
    socket_id TEXT NOT NULL,
    connected_at TIMESTAMP NOT NULL DEFAULT NOW()
);
