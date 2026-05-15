# 🚀 Team Task Manager

A full-stack **MERN Task Management Web App** for managing team projects, assigning tasks, tracking deadlines, and controlling user access with role-based permissions.

🔗 **Live Demo:** https://task-manager-fe-production-2fc2.up.railway.app/  
📂 **GitHub Repository:** https://github.com/Alkasingh09/team-task-manager.git  

---

## 📌 Project Overview

**Team Task Manager** helps teams organize projects, assign tasks, track progress, and manage deadlines from one responsive dashboard.

The application has separate **frontend** and **backend** services:

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- Authentication: JWT + bcryptjs
- Deployment: Railway

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- Secure password hashing using bcryptjs
- JWT-based authentication
- Protected routes
- Admin and member roles

### 👥 Role-Based Access

#### Admin
- Create, edit, and delete projects
- Add or remove project members
- Create and assign tasks
- Edit and delete tasks
- Mark tasks as overdue

#### Member
- View assigned projects
- View assigned tasks
- Update only the status of their own tasks

### 📁 Project Management
- Create new projects
- Edit project details
- Delete projects
- Add team members to projects
- View project-wise task progress

### ✅ Task Management
- Create and assign tasks
- Set priority levels
- Add due dates
- Track task status
- Filter tasks by status and priority
- Paginated task listing
- Overdue task tracking

### 📊 Dashboard
- Total tasks
- Completed tasks
- Pending tasks
- In-progress tasks
- Overdue tasks
- Project-wise progress

### 📱 Responsive UI
- Clean and modern interface
- Mobile-friendly design
- Built with Tailwind CSS

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| API Calls | Axios |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Deployment | Railway |

---

## 📂 Folder Structure

```text
team-task-manager/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   │
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   │
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Setup

Follow these steps to run the project locally.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Alkasingh09/team-task-manager.git
```

```bash
cd team-task-manager
```

---

## 2️⃣ Setup Backend Server

```bash
cd server
```

```bash
npm install
```

Create a `.env` file inside the `server` folder.

```bash
cp .env.example .env
```

Add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the server:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## 3️⃣ Setup Frontend Client

Open a new terminal.

```bash
cd client
```

```bash
npm install
```

Create a `.env` file inside the `client` folder.

```bash
cp .env.example .env
```

Add the following variable:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## 🌱 Optional Demo Data

You can seed demo users and sample data.

```bash
cd server
```

```bash
npm run seed
```

Demo login accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | password123 |
| Member | member@example.com | password123 |

---

## 🔗 API Documentation

Base URL:

```text
/api
```

---

## 🔐 Auth Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login user and get token |
| GET | `/auth/me` | Authenticated | Get current user |

Example register body:

```json
{
  "name": "Priya",
  "email": "priya@example.com",
  "password": "password123",
  "role": "admin"
}
```

---

## 📁 Project Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/projects` | Authenticated | List visible projects |
| POST | `/projects` | Admin | Create project |
| GET | `/projects/:id` | Project member/admin | Get project with tasks |
| PUT | `/projects/:id` | Admin | Update project |
| DELETE | `/projects/:id` | Admin | Delete project and related tasks |
| GET | `/projects/users` | Admin | List users for task assignment |

Example project body:

```json
{
  "title": "Website Redesign",
  "description": "Refresh the product website.",
  "members": ["USER_ID"]
}
```

---

## ✅ Task Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/tasks` | Authenticated | List tasks with filters and pagination |
| POST | `/tasks` | Admin | Create task |
| PUT | `/tasks/:id` | Admin or assigned member | Update task |
| DELETE | `/tasks/:id` | Admin | Delete task |

Example task query:

```text
GET /api/tasks?status=To%20Do&priority=High&page=1&limit=20
```

Example task body:

```json
{
  "title": "Create wireframes",
  "description": "Draft dashboard screens.",
  "priority": "High",
  "status": "To Do",
  "dueDate": "2026-05-30",
  "project": "PROJECT_ID",
  "assignedUser": "USER_ID"
}
```

---

## 📊 Dashboard Route

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Authenticated | Get task totals and project progress |

---

## 🚀 Deployment

The project is deployed on **Railway**.

### Live Frontend

```text
https://task-manager-fe-production-2fc2.up.railway.app/
```

---

## Railway Backend Service

Backend service settings:

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Backend environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=https://task-manager-fe-production-2fc2.up.railway.app
NODE_ENV=production
```

---

## Railway Frontend Service

Frontend service settings:

| Setting | Value |
|---|---|
| Root Directory | `client` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm run preview -- --port $PORT` |

Frontend environment variable:

```env
VITE_API_URL=https://your-server-url.railway.app/api
```

---

## 👩‍💻 Author

**Alka Singh**

GitHub: https://github.com/Alkasingh09

---

## 📌 Submission Links

| Type | Link |
|---|---|
| Live Project | https://task-manager-fe-production-2fc2.up.railway.app/ |
| GitHub Repository | https://github.com/Alkasingh09/team-task-manager.git |
| Deployment Platform | Railway |

---

## ⭐ Final Note

This project demonstrates a complete MERN stack workflow with authentication, protected APIs, role-based access, project management, task management, dashboard analytics, and cloud deployment.
