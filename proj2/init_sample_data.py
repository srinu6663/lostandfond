#!/usr/bin/env python3
"""
Initialize the database with sample data for testing
"""
import sqlite3
import os
from datetime import datetime

def init_sample_data():
    """Initialize database with sample data"""
    
    # Create instance directory if it doesn't exist
    os.makedirs('instance', exist_ok=True)
    
    # Connect to database
    conn = sqlite3.connect(os.path.join('instance', 'database.db'))
    conn.row_factory = sqlite3.Row
    
    try:
        # Create categories
        categories = [
            'Electronics',
            'Clothing',
            'Books',
            'Accessories',
            'Sports Equipment',
            'Personal Items'
        ]
        
        for category in categories:
            conn.execute('INSERT OR IGNORE INTO categories (name) VALUES (?)', (category,))
        
        # Create admin user
        from werkzeug.security import generate_password_hash
        admin_password = generate_password_hash('admin123')
        conn.execute('''
            INSERT OR IGNORE INTO users (username, email, password, is_admin) 
            VALUES (?, ?, ?, ?)
        ''', ('admin', 'admin@example.com', admin_password, 1))
        
        # Create test user
        user_password = generate_password_hash('user123')
        conn.execute('''
            INSERT OR IGNORE INTO users (username, email, password, is_admin) 
            VALUES (?, ?, ?, ?)
        ''', ('testuser', 'user@example.com', user_password, 0))
        
        # Get user and category IDs
        admin_user = conn.execute('SELECT id FROM users WHERE username = "admin"').fetchone()
        test_user = conn.execute('SELECT id FROM users WHERE username = "testuser"').fetchone()
        electronics_cat = conn.execute('SELECT id FROM categories WHERE name = "Electronics"').fetchone()
        clothing_cat = conn.execute('SELECT id FROM categories WHERE name = "Clothing"').fetchone()
        books_cat = conn.execute('SELECT id FROM categories WHERE name = "Books"').fetchone()
        
        # Sample items with and without images
        sample_items = [
            {
                'name': 'iPhone 14 Pro',
                'description': 'Black iPhone 14 Pro found in the library. Has a blue case with university sticker.',
                'category_id': electronics_cat['id'],
                'location': 'Main Library, 2nd Floor',
                'status': 'found',
                'image_path': 'uploads/09b68513-9d1e-4bbf-9068-d40c5c61b717_casino.png',  # existing image
                'date_found': '2024-06-28',
                'user_id': admin_user['id'],
                'approved': 1
            },
            {
                'name': 'Red Backpack',
                'description': 'Large red backpack with hiking patches. Contains textbooks and notebooks.',
                'category_id': clothing_cat['id'],
                'location': 'Student Center',
                'status': 'found',
                'image_path': None,  # No image
                'date_found': '2024-06-27',
                'user_id': test_user['id'],
                'approved': 1
            },
            {
                'name': 'Calculus Textbook',
                'description': 'Stewart Calculus 8th Edition with highlighted pages and bookmarks.',
                'category_id': books_cat['id'],
                'location': 'Mathematics Building, Room 205',
                'status': 'found',
                'image_path': None,
                'date_found': '2024-06-26',
                'user_id': admin_user['id'],
                'approved': 1
            },
            {
                'name': 'Wireless Headphones',
                'description': 'Sony WH-1000XM4 wireless headphones in black. Found in study room.',
                'category_id': electronics_cat['id'],
                'location': 'Library Study Room B',
                'status': 'found',
                'image_path': None,
                'date_found': '2024-06-25',
                'user_id': test_user['id'],
                'approved': 1
            },
            {
                'name': 'Blue Hoodie',
                'description': 'University branded blue hoodie, size M. Left in computer lab.',
                'category_id': clothing_cat['id'],
                'location': 'Computer Science Building, Lab 3',
                'status': 'found',
                'image_path': None,
                'date_found': '2024-06-24',
                'user_id': admin_user['id'],
                'approved': 1
            },
            {
                'name': 'Water Bottle',
                'description': 'Stainless steel water bottle with stickers. Found in gym.',
                'category_id': 6,  # Personal Items
                'location': 'Campus Gym',
                'status': 'found',
                'image_path': None,
                'date_found': '2024-06-23',
                'user_id': test_user['id'],
                'approved': 1
            }
        ]
        
        # Insert sample items
        for item in sample_items:
            # Check if item already exists
            existing = conn.execute('SELECT id FROM items WHERE name = ?', (item['name'],)).fetchone()
            if not existing:
                conn.execute('''
                    INSERT INTO items (name, description, category_id, location, status, 
                                     image_path, date_found, user_id, approved, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    item['name'], item['description'], item['category_id'], 
                    item['location'], item['status'], item['image_path'],
                    item['date_found'], item['user_id'], item['approved'],
                    datetime.now().isoformat()
                ))
        
        conn.commit()
        print("Sample data initialized successfully!")
        print("\nLogin credentials:")
        print("Admin: admin@example.com / admin123")
        print("User: user@example.com / user123")
        
    except Exception as e:
        print(f"Error initializing sample data: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    init_sample_data()
