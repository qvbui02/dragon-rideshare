CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    is_banned BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE banned_users (
    ban_id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INT NOT NULL,
    user_id INT NOT NULL,
    reason TEXT,
    banned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE trips (
    trip_id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_by INT NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    radius_km INT CHECK (radius_km >= 0),
    mode_of_transport VARCHAR(50) CHECK (mode_of_transport IN ('Car', 'Taxi', 'Other')),
    departure_time DATETIME NOT NULL,
    max_passengers INT CHECK (max_passengers >= 1),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE trip_members (
    trip_member_id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE chat_messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INT NOT NULL,
    sender_id INT NOT NULL,
    message TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE user_ratings (
    rating_id INTEGER PRIMARY KEY AUTOINCREMENT,
    rated_by INT NOT NULL,
    rated_user INT NOT NULL,
    trip_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rated_by) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (rated_user) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

CREATE TABLE reports (
    report_id INTEGER PRIMARY KEY AUTOINCREMENT,
    reported_by INT NOT NULL,
    reported_user INT NOT NULL,
    trip_id INT,
    reason TEXT NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Pending', 'Reviewed', 'Resolved')) DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_by) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_user) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

CREATE TABLE previous_travelers (
    travel_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_1 INT NOT NULL,
    user_2 INT NOT NULL,
    trip_id INT NOT NULL,
    UNIQUE (user_1, user_2, trip_id),
    FOREIGN KEY (user_1) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_2) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);