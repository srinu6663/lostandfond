# Campus Lost and Found System

A digital system for college campuses to manage lost and found items, allowing students to report lost items, search for found items, and facilitate the return process.

## Features

- User authentication (students and administrators)
- Report lost or found items with image upload
- Search items by category, status, and keywords
- Admin approval system for item listings
- Item status tracking (lost, found, claimed, returned)
- Responsive design for mobile and desktop

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite
- **Authentication**: Flask session-based auth

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Initialize the database:
   ```
   flask init-db
   ```
4. Run the application:
   ```
   flask run
   ```

## Default Admin Credentials

- **Email**: admin@college.edu
- **Password**: admin123

## Project Structure

- `app.py`: Main Flask application
- `schema.sql`: Database schema
- `static/`: Static files (CSS, JS, uploads)
- `templates/`: HTML templates
- `requirements.txt`: Python dependencies

## License

This project is available for educational purposes.