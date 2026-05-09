# Enterprise Team Task Manager — Backend API

A production-ready Django REST Framework backend for a Team Task Manager SaaS application with JWT authentication, RBAC, and modular architecture.

## Tech Stack

- **Python 3.9+** / **Django 4.2**
- **Django REST Framework** — API layer
- **SimpleJWT** — JWT authentication
- **SQLite** (dev) / **PostgreSQL** (production)
- **django-cors-headers** — CORS support for React frontend
- **django-filter** — Advanced query filtering
- **drf-spectacular** — Swagger/OpenAPI documentation

---

## Quick Start

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Copy environment variables
copy .env.example .env   # Windows
cp .env.example .env     # macOS/Linux

# 6. Run migrations
python manage.py makemigrations
python manage.py migrate

# 7. Create superuser (admin)
python manage.py createsuperuser

# 8. Start development server
python manage.py runserver
```

Server runs at: **http://127.0.0.1:8000/**

---

## API Documentation (Swagger)

| URL | Description |
|-----|-------------|
| `/api/docs/` | Swagger UI |
| `/api/redoc/` | ReDoc UI |
| `/api/schema/` | OpenAPI schema (JSON) |
| `/admin/` | Django Admin Panel |

---

## API Endpoints

### Authentication (`/api/auth/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register/` | Register new user | Public |
| POST | `/api/auth/login/` | Login & get JWT tokens | Public |
| POST | `/api/auth/logout/` | Logout (blacklist token) | Required |
| POST | `/api/auth/refresh/` | Refresh access token | Public |
| GET/PUT | `/api/auth/profile/` | Get/update profile | Required |
| POST | `/api/auth/change-password/` | Change password | Required |
| GET | `/api/auth/users/` | List all users | Admin |

### Projects (`/api/projects/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects/` | List projects | Required |
| POST | `/api/projects/` | Create project | Admin |
| GET | `/api/projects/{id}/` | Get project detail | Required |
| PUT/PATCH | `/api/projects/{id}/` | Update project | Admin |
| DELETE | `/api/projects/{id}/` | Delete project | Admin |
| POST | `/api/projects/{id}/add_members/` | Add team members | Admin |
| POST | `/api/projects/{id}/remove_members/` | Remove team members | Admin |

### Tasks (`/api/tasks/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks/` | List tasks | Required |
| POST | `/api/tasks/` | Create task | Admin |
| GET | `/api/tasks/{id}/` | Get task detail | Required |
| PUT/PATCH | `/api/tasks/{id}/` | Update task (admin) / status only (member) | Required |
| DELETE | `/api/tasks/{id}/` | Delete task | Admin |
| GET | `/api/tasks/my-tasks/` | Get my assigned tasks | Required |
| GET | `/api/tasks/overdue/` | Get overdue tasks | Required |

### Dashboard (`/api/dashboard/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard/admin/` | Admin analytics | Admin |
| GET | `/api/dashboard/member/` | Member analytics | Required |

### Notifications (`/api/notifications/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications/` | List notifications | Required |
| PATCH | `/api/notifications/{id}/` | Mark as read | Owner |
| POST | `/api/notifications/mark-all-read/` | Mark all as read | Required |
| GET | `/api/notifications/unread-count/` | Get unread count | Required |

### Activities (`/api/activities/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/activities/` | List activity logs | Admin |

---

## Authentication Flow

All protected APIs require the `Authorization` header:

```
Authorization: Bearer <access_token>
```

### Register
```json
POST /api/auth/register/
{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "StrongPass123!",
    "confirm_password": "StrongPass123!",
    "role": "admin"
}
```

### Login
```json
POST /api/auth/login/
{
    "email": "john@example.com",
    "password": "StrongPass123!"
}
```

### Response Format
All APIs return a consistent JSON format:
```json
{
    "success": true,
    "status_code": 200,
    "message": "Login successful.",
    "data": { ... }
}
```

---

## Query Parameters

### Filtering
- Projects: `?status=in_progress&created_by=1`
- Tasks: `?status=todo&priority=high&project=1&assigned_to=2`

### Search
- `?search=keyword` — searches name/title and description

### Ordering
- `?ordering=-created_at` (descending)
- `?ordering=deadline` (ascending)

### Pagination
- `?page=1&page_size=20`

---

## Roles & Permissions

| Action | Admin | Member |
|--------|-------|--------|
| Create project | ✅ | ❌ |
| View all projects | ✅ | Own only |
| Create task | ✅ | ❌ |
| Update task (all fields) | ✅ | ❌ |
| Update task status | ✅ | ✅ (assigned only) |
| Delete task | ✅ | ❌ |
| View dashboard (admin) | ✅ | ❌ |
| View dashboard (member) | ✅ | ✅ |
| Manage users | ✅ | ❌ |
| View activities | ✅ | ❌ |

---

## Project Structure

```
backend/
├── config/                # Django config
│   ├── settings/
│   │   ├── base.py       # Shared settings
│   │   ├── development.py # SQLite, debug=True
│   │   └── production.py  # PostgreSQL, security
│   ├── urls.py           # Root URL config
│   ├── wsgi.py
│   └── asgi.py
├── accounts/             # Auth + User model + RBAC
├── projects/             # Project CRUD
├── tasks/                # Task CRUD + signals
├── dashboard/            # Analytics APIs
├── notifications/        # In-app notifications
├── activities/           # Audit/activity log
├── core/                 # Pagination, exceptions, responses
├── requirements.txt
├── .env.example
└── manage.py
```

---

## Frontend Integration (React/Axios)

```javascript
// axios instance
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

// Attach JWT token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-refresh on 401
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const refresh = localStorage.getItem('refresh_token');
            const { data } = await axios.post('/api/auth/refresh/', { refresh });
            localStorage.setItem('access_token', data.access);
            error.config.headers.Authorization = `Bearer ${data.access}`;
            return API(error.config);
        }
        return Promise.reject(error);
    }
);
```
