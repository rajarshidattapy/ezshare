# 🔐 Ezshare

VaultShare is a secure and simple Django-based file sharing platform. Authenticated users can upload files, generate unique download links, and optionally set an expiry duration. Built for privacy, speed, and ease of use.
---

## 🚀 Features

- 🔐 **User Authentication** (Register/Login/Logout)
- 📤 **File Uploads** with size and type validation
- 🔗 **Unique Download Links** (Shareable)
- ⏳ **Link Expiration** Support (optional)
- 🧹 **Auto Cleanup** with Celery & Redis
- 📦 Supports **local** and **S3 file storage**
- ⚙️ **Admin Panel** for file management
- 🌐 **Dockerized** and ready for deployment

---

## 📸 Demo

![Demo GIF](https://yourdomain.com/demo.gif)  
🔗 [Live Demo](https://vaultshare.yourdomain.com)

---

## ⚙️ Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Backend     | Django, DRF                   |
| Database    | PostgreSQL / SQLite (dev)     |
| Asynchronous| Celery + Redis                |
| Storage     | Local / AWS S3                |
| Auth        | Django Sessions / JWT (opt.)  |
| Deployment  | Docker, Gunicorn, Nginx       |

---

## 🛠️ Installation

### 🔧 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vaultshare.git
cd vaultshare
````

### 🧪 2. Setup Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 📦 3. Install Requirements

```bash
pip install -r requirements.txt
```

### 🔐 4. Configure `.env`

Create a `.env` file in the project root:

```env
DEBUG=True
SECRET_KEY=your_secret_key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
USE_S3=False
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_STORAGE_BUCKET_NAME=vaultshare-bucket
```

### 🔄 5. Run Migrations

```bash
python manage.py migrate
```

### 🚀 6. Start Development Server

```bash
python manage.py runserver
```

---

## 🐳 Docker Setup

### Build & Start

```bash
docker-compose up --build
```

Access at `http://localhost:8000`

---

## ✏️ File Upload Workflow

1. User logs in and uploads file.
2. File is stored securely (local/S3).
3. A unique shareable link is generated.
4. If expiry is set, link becomes invalid after deadline.
5. Admins can monitor file logs.

---

## 🧪 Running Tests

```bash
python manage.py test
```

---

## ✨ Screenshots

> Upload a few key screenshots here
>
> * Login Page
> * Upload Interface
> * Download Page

---

## 🧹 Celery Cleanup (Optional)

To run Celery for file expiry/deletion:

```bash
celery -A vaultshare worker --loglevel=info
```

And in another terminal:

```bash
celery -A vaultshare beat --loglevel=info
```

Make sure Redis is running.

---

## 📂 Folder Structure

```
vaultshare/
├── core/               # Main app for file logic
├── users/              # User authentication
├── templates/          # HTML templates
├── static/             # Static files (CSS, JS)
├── media/              # Uploaded files (dev)
├── vaultshare/         # Django project settings
├── docker-compose.yml
├── requirements.txt
```

---

## 🧑‍💻 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/awesome`
3. Commit: `git commit -m 'Add awesome feature'`
4. Push: `git push origin feature/awesome`
5. Open a PR 🙌

---

## 📄 License

MIT License © [Your Name](https://github.com/yourusername)

---

## 🔗 Links

* 🔥 [Live App](https://vaultshare.yourdomain.com)
* 📚 [Documentation](https://docs.yourdomain.com)
* 🧠 [About the Author](https://yourportfolio.com)

---


