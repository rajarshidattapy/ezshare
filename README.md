# Ezshare - Secure File Sharing Application

A modern, secure file sharing application built with Django and vanilla JavaScript. Ezshare provides a beautiful, production-ready interface for uploading, managing, and sharing files with JWT-based authentication.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with access and refresh tokens
- Secure user registration and login
- Token-based API protection
- User-specific file storage and access control

### 📁 File Management
- **Drag & Drop Upload**: Intuitive file upload with visual feedback
- **Multi-file Support**: Upload multiple files simultaneously
- **File Organization**: User-specific file storage with metadata tracking
- **Download Options**: Individual file downloads or ZIP bundling for multiple files
- **File Statistics**: Track file sizes, upload dates, and download counts

### 🎨 User Interface
- **Modern Design**: Glassmorphism UI with gradient backgrounds
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Feedback**: Toast notifications and loading states
- **Interactive Elements**: Hover effects, animations, and micro-interactions
- **File Management**: Select, download, and delete files with ease

### 📊 Dashboard Features
- User statistics (total files, storage used, download count)
- File grid with search and filter capabilities
- Bulk operations (select all, download multiple)
- File type recognition with appropriate icons

## 🛠️ Tech Stack

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework 3.14.0** - API development
- **Django Simple JWT 5.3.0** - JWT authentication
- **Django CORS Headers 4.3.1** - Cross-origin resource sharing
- **Pillow 10.0.1** - Image processing
- **Python Decouple 3.8** - Environment variable management

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox/grid
- **Vanilla JavaScript** - Interactive functionality
- **Inter Font** - Typography

### Database
- **SQLite** (development) - Easily configurable for PostgreSQL/MySQL in production

## 📁 Project Structure

```
ezshare/
├── ezshare/                    # Main Django project
│   ├── __init__.py
│   ├── settings.py            # Django settings
│   ├── urls.py                # Main URL configuration
│   └── wsgi.py                # WSGI configuration
├── accounts/                   # User authentication app
│   ├── models.py              # Custom User model
│   ├── serializers.py         # DRF serializers
│   ├── views.py               # Authentication views
│   ├── urls.py                # Auth URL patterns
│   └── admin.py               # Admin configuration
├── files/                      # File management app
│   ├── models.py              # File and ShareLink models
│   ├── serializers.py         # File serializers
│   ├── views.py               # File management views
│   ├── urls.py                # File URL patterns
│   └── admin.py               # File admin interface
├── templates/                  # HTML templates
│   └── index.html             # Main application template
├── static/                     # Static files
│   ├── css/
│   │   └── style.css          # Application styles
│   └── js/
│       └── main.js            # Frontend JavaScript
├── media/                      # User uploaded files
├── requirements.txt            # Python dependencies
├── manage.py                   # Django management script
├── .env.example               # Environment variables template
└── README.md                  # Project documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ezshare
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
```bash
cp .env.example .env
# Edit .env file with your configuration
```

### 5. Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 7. Collect Static Files
```bash
python manage.py collectstatic
```

### 8. Run Development Server
```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000` to access the application.


### Environment Variables
See `.env.example` for all available configuration options.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Django.**