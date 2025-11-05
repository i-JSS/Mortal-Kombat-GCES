CREATE TABLE IF NOT EXISTS games (
    game_id SERIAL PRIMARY KEY,
    game_name TEXT NOT NULL,
    game_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
    player_id SERIAL PRIMARY KEY,
    player_id TEXT NOT NULL,
    game_id TEXT REFERENCES games(game_id)
);
