-- Schema for Campus Lost and Found System

-- Drop tables if they exist
DROP TABLE IF EXISTS claims;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Items table
CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category_id INTEGER NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL, -- 'lost', 'found', 'claimed', 'returned'
    image_path TEXT,
    date_found TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    approved INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Claims table
CREATE TABLE claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL, -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Insert default categories
INSERT INTO categories (name) VALUES 
('Electronics'), 
('Books & Stationery'), 
('Clothing & Accessories'), 
('ID Cards & Documents'), 
('Keys'), 
('Bags & Luggage'), 
('Jewelry & Watches'), 
('Sports Equipment'),
('Other');

-- -- Insert admin user (password: admin123)
-- INSERT INTO users (username, email, password, is_admin) 
-- VALUES ('Admin', 'admin@college.edu', 'pbkdf2:sha256:150000$KN84rZHl$bbb9d89f83b3a1bd3e4a917b5082d058acfbaf0c30b4526573b5c693dce77bcd', 1);