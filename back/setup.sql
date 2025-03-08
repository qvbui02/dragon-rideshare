CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE verification_tokens (
    token_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE admins (
    user_id INT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE banned_users (
    admin_id INT NOT NULL,
    user_id INT NOT NULL,
    reason TEXT,
    banned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (admin_id, user_id),
    FOREIGN KEY (admin_id) REFERENCES admins(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE trips (
    trip_id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_by INT NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    source_latitude DECIMAL(10, 8),
    source_longitude DECIMAL(11, 8),
    destination_latitude DECIMAL(10, 8),
    destination_longitude DECIMAL(11, 8),
    source_radius INT CHECK (source_radius >= 0),
    destination_radius INT CHECK (destination_radius >= 0),
    mode_of_transport VARCHAR(50) CHECK (mode_of_transport IN ('Car', 'Taxi', 'Other')),
    departure_time DATETIME NOT NULL,
    departure_date TIMESTAMP NOT NULL,
    max_passengers INT CHECK (max_passengers >= 1),
    hours INT CHECK (hours >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE trip_members (
    trip_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (trip_id, user_id),
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
    rated_by INT NOT NULL,
    rated_user INT NOT NULL,
    trip_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (rated_by, rated_user, trip_id),
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

-- Insert admin user
INSERT INTO users (email, password, full_name, phone_number, is_verified)
VALUES ('vj92@drexel.edu', '$argon2id$v=19$m=65536,t=3,p=4$bLpTjx5IaE5EGA9KHU4Nvw$s/aIOYq6Yffk7IU2SacPfbBkk7xGUtPnWmMfuQJ03TE', 'Vatsal Jain', '445-237-5934', TRUE);

-- Add user to admins table
INSERT INTO admins (user_id)
SELECT user_id FROM users WHERE email = 'vj92@drexel.edu';

-- ✅ Add two more verified users
INSERT INTO users (email, password, full_name, phone_number, is_verified)
VALUES 
('user1@drexel.edu', '$argon2id$v=19$m=65536,t=3,p=4$bLpTjx5IaE5EGA9KHU4Nvw$s/aIOYq6Yffk7IU2SacPfbBkk7xGUtPnWmMfuQJ03TE', 'User One', '555-123-4567', TRUE),
('user2@drexel.edu', '$argon2id$v=19$m=65536,t=3,p=4$bLpTjx5IaE5EGA9KHU4Nvw$s/aIOYq6Yffk7IU2SacPfbBkk7xGUtPnWmMfuQJ03TE', 'User Two', '555-987-6543', TRUE);

-- ✅ Insert a minimal trip (created by User One)
INSERT INTO trips (
    created_by, 
    source, destination, 
    source_latitude, source_longitude, 
    destination_latitude, destination_longitude, 
    source_radius, destination_radius, 
    mode_of_transport, departure_time, departure_date, 
    max_passengers, hours, 
    is_active, created_at
) VALUES (
    (SELECT user_id FROM users WHERE email = 'user1@drexel.edu'),
    'Drexel University', 'Philadelphia City Hall',
    39.9566127, -75.1899441,
    39.952583, -75.165222,
    5, 5,
    'Car', '2025-03-01 08:00:00', '2025-03-01',
    4, 2,
    TRUE, CURRENT_TIMESTAMP
);

-- ✅ Add User One (trip creator) as a member of the trip
INSERT INTO trip_members (trip_id, user_id)
VALUES (
    (SELECT trip_id FROM trips WHERE created_by = (SELECT user_id FROM users WHERE email = 'user1@drexel.edu')),
    (SELECT user_id FROM users WHERE email = 'user1@drexel.edu')
);

-- ✅ Add User Two as a member of the trip
INSERT INTO trip_members (trip_id, user_id)
VALUES (
    (SELECT trip_id FROM trips WHERE created_by = (SELECT user_id FROM users WHERE email = 'user1@drexel.edu')),
    (SELECT user_id FROM users WHERE email = 'user2@drexel.edu')
);

-- ✅ Insert a sample report where User Two reports User One
INSERT INTO reports (reported_by, reported_user, trip_id, reason, status)
VALUES (
    (SELECT user_id FROM users WHERE email = 'user2@drexel.edu'),
    (SELECT user_id FROM users WHERE email = 'user1@drexel.edu'),
    (SELECT trip_id FROM trips WHERE created_by = (SELECT user_id FROM users WHERE email = 'user1@drexel.edu')),
    'Inappropriate behavior during the ride',
    'Pending'
);