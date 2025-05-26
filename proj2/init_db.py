import sqlite3
import os
from werkzeug.security import generate_password_hash

def init_db():
    # Get the absolute path to your project directory
    basedir = os.path.abspath(os.path.dirname(__file__))

    # Ensure the instance directory exists
    instance_dir = os.path.join(basedir, 'instance')
    os.makedirs(instance_dir, exist_ok=True)

    # Define path for the SQLite database
    db_path = os.path.join(instance_dir, 'database.db')

    # Connect to the database and execute schema
    with sqlite3.connect(db_path) as conn:
        with open('schema.sql', 'r') as f:
            conn.executescript(f.read())

        # Insert admin user with hashed password
        hashed_password = generate_password_hash('Admin123')

        conn.execute("""
            INSERT INTO users (username, email, password, is_admin) 
            VALUES (?, ?, ?, ?)
        """, ('Admin', 'admin@college.edu', hashed_password, 1))

        conn.commit()

    print("✅ Database created and admin user added successfully at:", db_path)

# Run only when this file is executed
if __name__ == '__main__':
    init_db()
