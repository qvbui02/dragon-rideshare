CREATE TABLE users (
    username TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    f_name TEXT NOT NULL,
    l_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    id INTEGER PRIMARY KEY REFERENCES users(username),
    became_admin_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blocks (
    username TEXT PRIMARY KEY
);

CREATE TABLE trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_by TEXT NOT NULL REFERENCES users(username),
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    transportation_type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL
);

CREATE TABLE user_to_trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_username TEXT NOT NULL REFERENCES users(username),
    trip_id INTEGER NOT NULL REFERENCES trips(id),
    rated BOOLEAN DEFAULT 0,
    UNIQUE (user_username, trip_id)
);

CREATE TABLE group_chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL REFERENCES trips(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL REFERENCES trips(id),
    sender_username TEXT NOT NULL REFERENCES users(username),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rating (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rater_username TEXT NOT NULL REFERENCES users(username),
    rated_username TEXT REFERENCES users(username),
    trip_id INTEGER NOT NULL REFERENCES trips(id),
    rating INTEGER CHECK(rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);