# Ether Tasks — Enterprise Team Task Manager

Ether Tasks is a professional, full-stack SaaS platform designed for high-performing teams to manage projects, tasks, and team collaboration with an elegant, modern light-themed interface.

![Dashboard Preview](https://via.placeholder.com/1200x600.png?text=Ether+Tasks+Dashboard+Preview)

## 🚀 Key Features

- **Enterprise Dashboard**: Real-time analytics for admins and personalized workload views for members.
- **Project Management**: Organize work into projects with progress tracking and team assignment.
- **Task Management**: Kanban board and list views with priority levels, deadlines, and status updates.
- **Team Management**: Robust admin tools for adding, removing, and restoring team members with role-based access control (RBAC).
- **Notifications**: Centralized notification center for task assignments and status updates.
- **Security**: JWT-based authentication with secure password hashing and protected API endpoints.
- **Design System**: A custom, theme-aware CSS design system built with Tailwind CSS for a premium light-themed experience.

## 🛠️ Technology Stack

### Frontend
- **React.js**: Modern UI library.
- **Redux Toolkit**: Predictable state management.
- **Tailwind CSS**: Utility-first CSS framework for custom styling.
- **Lucide React**: Beautifully simple icons.
- **Recharts**: Composable charting library for dashboard analytics.

### Backend
- **Django**: High-level Python web framework.
- **Django REST Framework (DRF)**: Powerful toolkit for building Web APIs.
- **PostgreSQL**: Production-ready relational database (SQLite used for local development).
- **SimpleJWT**: Secure authentication with JSON Web Tokens.

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/project-ether.git
cd project-ether
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📸 Screen Previews

- **Team Management**: Modern responsive tables with soft-delete functionality.
- **Kanban Board**: Drag-and-drop style task management.
- **Analytics**: Visual breakdown of task statuses and team productivity.

## 📄 License

This project is licensed under the MIT License.
