from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime
import sqlite3
import os
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Database initialization
def get_db_connection():
    # Use relative path for better portability
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'database.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs('instance', exist_ok=True)
    conn = get_db_connection()
    with open('schema.sql') as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

# Check if file extension is allowed
def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Routes
@app.route('/')
def index():
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    items = conn.execute('''
        SELECT items.*, categories.name AS category_name, users.username
        FROM items
        JOIN categories ON items.category_id = categories.id
        JOIN users ON items.user_id = users.id
        WHERE approved = 1
        ORDER BY date_found DESC
    ''').fetchall()
    conn.close()
    return render_template('index.html', items=items)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        conn.close()
        
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['is_admin'] = user['is_admin']
            
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password', 'error')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        conn = get_db_connection()
        if conn.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone():
            flash('Email already registered', 'error')
            conn.close()
            return render_template('register.html')
        
        hashed_password = generate_password_hash(password)
        conn.execute(
            'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)',
            (username, email, hashed_password, 0)
        )
        conn.commit()
        conn.close()
        
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out', 'info')
    return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash('Please login to access the dashboard', 'error')
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    if session.get('is_admin'):
        # Admin sees all items with pending approval
        items = conn.execute(
            '''SELECT items.*, categories.name as category_name, users.username
               FROM items 
               JOIN categories ON items.category_id = categories.id
               JOIN users ON items.user_id = users.id
               ORDER BY items.created_at DESC'''
        ).fetchall()
    else:
        # Regular users see their own reported items and all approved items
        items = conn.execute(
            '''SELECT items.*, categories.name as category_name, users.username
               FROM items 
               JOIN categories ON items.category_id = categories.id
               JOIN users ON items.user_id = users.id
               WHERE items.approved = 1 OR items.user_id = ?
               ORDER BY items.created_at DESC''',
            (session['user_id'],)
        ).fetchall()
    
    categories = conn.execute('SELECT * FROM categories').fetchall()
    conn.close()
    
    return render_template('dashboard.html', items=items, categories=categories)

@app.route('/report', methods=['GET', 'POST'])
def report_item():
    if 'user_id' not in session:
        flash('Please login to report an item', 'error')
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    categories = conn.execute('SELECT * FROM categories').fetchall()
    
    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        category_id = request.form['category_id']
        location = request.form['location']
        report_type = request.form['report_type']
        date_found = request.form.get('date_found') or datetime.now().strftime('%Y-%m-%d')
        
        # Handle image upload
        image_path = None
        if 'image' in request.files and request.files['image'].filename:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                unique_filename = f"{uuid.uuid4()}_{filename}"
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(file_path)
                image_path = f"uploads/{unique_filename}"
        
        conn.execute(
            '''INSERT INTO items (name, description, category_id, location, status, 
                                image_path, date_found, user_id, approved)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (name, description, category_id, location, report_type, 
             image_path, date_found, session['user_id'], 0)
        )
        conn.commit()
        conn.close()
        
        flash('Item reported successfully! Awaiting approval.', 'success')
        return redirect(url_for('dashboard'))
    
    conn.close()
    return render_template('report.html', categories=categories)

# @app.route('/item/<int:item_id>')
# def view_item(item_id):
#     conn = get_db_connection()
#     item = conn.execute(
#         '''SELECT items.*, categories.name as category_name, users.username
#             FROM items 
#             JOIN categories ON items.category_id = categories.id
#             JOIN users ON items.user_id = users.id
#             WHERE items.id = ?''',
#         (item_id,)
#     ).fetchone()
#     conn.close()
    
#     if not item:
#         flash('Item not found', 'error')
#         return redirect(url_for('dashboard'))
    
#     return render_template('item_detail.html', item=item)


@app.route('/item/<int:item_id>')
def view_item(item_id):
    conn = get_db_connection()
    item = conn.execute(
        '''
        SELECT items.*, categories.name AS category_name, users.username
        FROM items
        JOIN categories ON items.category_id = categories.id
        JOIN users ON items.user_id = users.id
        WHERE items.id = ?
        ''',
        (item_id,)
    ).fetchone()
    conn.close()

    if not item:
        flash('Item not found', 'error')
        return redirect(url_for('dashboard'))
    
    
    return render_template('item_detail.html', item=item)


@app.route('/profile')
def profile():
    if not session.get('user_id'):
        return redirect(url_for('login'))
    return render_template('profile.html', username=session.get('username'))



@app.route('/delete_account', methods=['POST'])
def delete_account():
    if 'user_id' not in session:
        flash('Please log in first.', 'error')
        return redirect(url_for('login'))

    user_id = session['user_id']

    conn = get_db_connection()

    # Optional: Also delete all their reported items
    conn.execute('DELETE FROM items WHERE user_id = ?', (user_id,))
    conn.execute('DELETE FROM claims WHERE user_id = ?', (user_id,))
    conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()

    session.clear()
    flash('Your account and related data have been deleted.', 'info')
    return redirect(url_for('index'))




# Admins can approve or reject submitted items via POST requests:
@app.route('/admin/approve/<int:item_id>', methods=['POST'])
def approve_item(item_id):
    if 'user_id' not in session or not session.get('is_admin'):
        return jsonify({'success': False, 'error': 'Unauthorized access'}), 403
    
    conn = get_db_connection()
    conn.execute('UPDATE items SET approved = 1 WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/admin/reject/<int:item_id>', methods=['POST'])
def reject_item(item_id):
    if 'user_id' not in session or not session.get('is_admin'):
        return jsonify({'success': False, 'error': 'Unauthorized access'}), 403
    
    conn = get_db_connection()
    conn.execute('DELETE FROM items WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/search')
def search():
    query = request.args.get('query', '')
    category_id = request.args.get('category_id', '')
    status = request.args.get('status', '')
    
    conn = get_db_connection()
    sql_query = '''SELECT items.*, categories.name as category_name, users.username
                    FROM items 
                    JOIN categories ON items.category_id = categories.id
                    JOIN users ON items.user_id = users.id
                    WHERE items.approved = 1'''
    params = []
    
    if query:
        sql_query += ' AND (items.name LIKE ? OR items.description LIKE ?)'
        params.extend([f'%{query}%', f'%{query}%'])
    
    if category_id:
        sql_query += ' AND items.category_id = ?'
        params.append(category_id)
    
    if status:
        sql_query += ' AND items.status = ?'
        params.append(status)
    
    items = conn.execute(sql_query, params).fetchall()
    categories = conn.execute('SELECT * FROM categories').fetchall()
    conn.close()
    
    return render_template('search_results.html', items=items, categories=categories, 
                            query=query, category_id=category_id, status=status)

@app.route('/mark_returned/<int:item_id>', methods=['POST'])
def mark_returned(item_id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'error': 'Unauthorized access'}), 403
    
    conn = get_db_connection()
    item = conn.execute('SELECT * FROM items WHERE id = ?', (item_id,)).fetchone()
    
    if not item:
        conn.close()
        return jsonify({'success': False, 'error': 'Item not found'}), 404
    
    # Only admin or the item reporter can mark as returned
    if not session.get('is_admin') and session['user_id'] != item['user_id']:
        conn.close()
        return jsonify({'success': False, 'error': 'Unauthorized access'}), 403
    
    conn.execute('UPDATE items SET status = ? WHERE id = ?', ('returned', item_id))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/claim_request/<int:item_id>', methods=['POST'])
def claim_request(item_id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'error': 'Unauthorized access'}), 403
    
    conn = get_db_connection()
    item = conn.execute('SELECT * FROM items WHERE id = ?', (item_id,)).fetchone()
    
    if not item:
        conn.close()
        return jsonify({'success': False, 'error': 'Item not found'}), 404
    
    description = request.form.get('description', '')
    conn.execute(
        'INSERT INTO claims (item_id, user_id, description, status) VALUES (?, ?, ?, ?)',
        (item_id, session['user_id'], description, 'pending')
    )
    conn.commit()
    conn.close()
    
    flash('Claim request submitted successfully!', 'success')
    return redirect(url_for('view_item', item_id=item_id))

# Initialize the database
@app.cli.command('init-db')
def init_db_command():
    init_db()
    print('Database initialized.')

if __name__ == '__main__':
    # Initialize database if it doesn't exist
    if not os.path.exists(os.path.join(os.path.dirname(__file__), 'instance', 'database.db')):
        init_db()
    
    # Run in debug mode for development, production mode for deployment
    app.run(debug=os.environ.get('FLASK_ENV') == 'development', host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))