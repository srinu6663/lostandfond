# 🔍 Campus Lost & Found System

A modern, responsive web application built with Flask that helps campus community members report lost items and reunite them with their owners. Features a sleek UI with glassmorphism design, real-time notifications, and comprehensive admin controls.

![Campus Lost & Found](https://img.shields.io/badge/Flask-2.0+-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)

## ✨ Features

### 🎯 Core Functionality
- **Item Reporting**: Users can report lost or found items with detailed descriptions
- **Advanced Search**: Filter items by category, location, date, and keywords
- **User Authentication**: Secure registration and login system
- **Admin Panel**: Comprehensive admin controls for item approval and management
- **Claim System**: Users can claim items with verification process
- **Image Upload**: Support for item photos with secure file handling

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Glassmorphism**: Modern glass-like design with blur effects
- **Animated Dashboard**: Interactive stats and smooth transitions
- **Dark Mode Ready**: Prepared for dark theme implementation
- **Accessibility**: WCAG compliant with proper ARIA labels

### 🔐 Security Features
- **Password Hashing**: Secure password storage using Werkzeug
- **Session Management**: Secure user sessions with Flask-Session
- **File Upload Security**: Validated file types and secure filename handling
- **SQL Injection Prevention**: Parameterized queries throughout
- **Admin Role Control**: Role-based access control for admin functions

## 🛠️ Technology Stack

### Backend
- **Flask** - Python web framework
- **SQLite** - Lightweight database
- **Werkzeug** - WSGI utilities and security
- **Python 3.8+** - Core programming language

### Frontend
- **HTML5** - Modern semantic markup
- **CSS3** - Advanced styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Dynamic interactions and animations
- **Font Awesome** - Icon library
- **Google Fonts** - Typography (Inter & Plus Jakarta Sans)

### Database Schema
- **Users** - Authentication and profile management
- **Items** - Lost/found item records
- **Categories** - Item categorization
- **Claims** - Item claim requests

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Git (for cloning the repository)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/srinu6663/lostandfond.git
   cd lostandfond/proj2
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the database**
   ```bash
   python init_db.py
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:5000`
   - Register a new account or use existing credentials

### Database Setup

The application uses SQLite for data storage. The database is automatically created when you run `init_db.py`.

**Default Admin Account:**
- Email: `admin@campus.edu`
- Password: `admin123`

## 📋 Usage Guide

### For Students

1. **Register/Login**
   - Create an account with your campus email
   - Login to access the dashboard

2. **Report Lost Items**
   - Click "Report Item" in the navigation
   - Fill out the form with item details
   - Upload a photo (optional)
   - Submit for admin approval

3. **Search for Items**
   - Use the search bar on the homepage
   - Filter by category, location, or date
   - Browse through found items

4. **Claim Items**
   - Click on an item to view details
   - Submit a claim request with proof of ownership
   - Wait for admin verification

### For Administrators

1. **Access Admin Panel**
   - Login with admin credentials
   - Navigate to the dashboard

2. **Manage Items**
   - Approve or reject submitted items
   - Mark items as returned
   - Delete inappropriate content

3. **Monitor Activity**
   - View all user activities
   - Check claim requests
   - Generate reports

## 🎨 UI Components

### Dashboard Features
- **Animated Statistics**: Real-time counters with smooth animations
- **Tabbed Interface**: Organized content with modern tabs
- **Item Cards**: Beautiful cards with hover effects
- **Responsive Grid**: Adaptive layout for all screen sizes

### Navigation
- **Modern Navbar**: Glassmorphism design with smooth transitions
- **User Dropdown**: Profile menu with user actions
- **Mobile Menu**: Hamburger menu for mobile devices
- **Breadcrumbs**: Easy navigation tracking

### Forms
- **Modern Input Fields**: Styled form elements with validation
- **File Upload**: Drag-and-drop file upload interface
- **Button Variants**: Primary, secondary, and accent buttons
- **Error Handling**: User-friendly error messages

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///instance/database.db
UPLOAD_FOLDER=static/uploads
MAX_CONTENT_LENGTH=16777216
```

### Application Settings
Key configurations in `app.py`:

```python
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
```

## 📁 Project Structure

```
proj2/
├── app.py                 # Main Flask application
├── init_db.py            # Database initialization
├── schema.sql            # Database schema
├── requirements.txt      # Python dependencies
├── Procfile              # Deployment configuration
├── README.md             # Project documentation
├── instance/
│   └── database.db       # SQLite database
├── static/
│   ├── css/
│   │   └── styles.css    # Main stylesheet
│   ├── js/
│   │   └── main.js       # JavaScript functionality
│   └── uploads/          # Uploaded images
└── templates/
    ├── base.html         # Base template
    ├── index.html        # Homepage
    ├── dashboard.html    # User dashboard
    ├── login.html        # Login page
    ├── register.html     # Registration page
    ├── report.html       # Item reporting
    ├── search_results.html # Search results
    ├── item_detail.html  # Item details
    └── profile.html      # User profile
```

## 🚀 Deployment

### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Local Production Setup

1. **Install Production Server**
   ```bash
   pip install gunicorn
   ```

2. **Run with Gunicorn**
   ```bash
   gunicorn --bind 0.0.0.0:5000 app:app
   ```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 style guide for Python code
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design principles

## 🐛 Known Issues

- [ ] File upload progress indicator
- [ ] Email notifications for claims
- [ ] Advanced search filters
- [ ] Bulk item management
- [ ] Export functionality

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Flask Community** - For the excellent web framework
- **Font Awesome** - For the beautiful icons
- **Google Fonts** - For the typography
- **Unsplash** - For placeholder images
- **GitHub** - For hosting and version control

## 📞 Support

If you encounter any issues or have questions:

1. **Check the Issues page** on GitHub
2. **Create a new issue** with detailed description
3. **Contact the maintainer** at lostandfound@campus.edu

## 🔮 Future Enhancements

- [ ] **Mobile App** - React Native mobile application
- [ ] **Real-time Chat** - WebSocket-based messaging
- [ ] **AI-Powered Matching** - Machine learning for item matching
- [ ] **QR Code Integration** - QR codes for quick item reporting
- [ ] **Multi-language Support** - Internationalization
- [ ] **Advanced Analytics** - Detailed reporting and analytics
- [ ] **Integration APIs** - Third-party service integrations

---

<div align="center">
  <strong>Built with ❤️ for the campus community</strong>
  <br>
  <em>Helping people reconnect with their belongings</em>
</div>