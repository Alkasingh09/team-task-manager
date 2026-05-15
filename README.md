# Team Task Manager

A full-stack MERN web application for managing team projects, task assignments, deadlines, and role-based access. The app uses a separate client/server architecture with React + Tailwind CSS on the frontend and Node.js + Express + MongoDB on the backend.

## Features

- JWT authentication with bcrypt password hashing
- Admin and member roles
- Protected API routes and role-based authorization
- Project creation, editing API, deletion, and team membership
- Task creation, assignment, status updates, priorities, due dates, and overdue tracking
- Dashboard totals for total, completed, pending, in-progress, overdue tasks, and project-wise progress
- Task filtering by status and priority
- Paginated task API
- Responsive React UI

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router, Lucide icons
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JWT and bcryptjs
- Deployment target: Railway

## Folder Structure

```text
client/
  src/
    components/
    context/
    pages/
server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
```

## Local Setup

### 1. Server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in `server/.env`.

Optional demo data:

```bash
npm run seed
```

Demo accounts after seeding:

- `admin@example.com` / `password123`
- `member@example.com` / `password123`

### 2. Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:5000/api` in `client/.env`.

## API Documentation

Base URL: `/api`

### Auth

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register a user |
| POST | `/auth/login` | Public | Log in and receive JWT |
| GET | `/auth/me` | Authenticated | Get current user |

Register body:

```json
{
  "name": "Priya",
  "email": "priya@example.com",
  "password": "password123",
  "role": "admin"
}
```

### Projects

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/projects` | Authenticated | List visible projects |
| POST | `/projects` | Admin | Create project |
| GET | `/projects/:id` | Project member/admin | Get project with tasks |
| PUT | `/projects/:id` | Admin | Update project |
| DELETE | `/projects/:id` | Admin | Delete project and tasks |
| GET | `/projects/users` | Admin | List users for assignment |

Project body:

```json
{
  "title": "Website Redesign",
  "description": "Refresh the product website.",
  "members": ["USER_ID"]
}
```

### Tasks

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/tasks` | Authenticated | List tasks with filters and pagination |
| POST | `/tasks` | Admin | Create task |
| PUT | `/tasks/:id` | Admin or assigned member | Admin edits task; member updates own status only |
| DELETE | `/tasks/:id` | Admin | Delete task |

Task query filters:

```text
GET /api/tasks?status=To%20Do&priority=High&page=1&limit=20
```

Task body:

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

### Dashboard

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/dashboard` | Authenticated | Get task totals and project progress |

## Role Rules

- Admins can create, edit, and delete projects.
- Admins can add/remove project members through the project update API.
- Admins can create, assign, edit, delete, and mark tasks overdue.
- Members can view assigned projects and tasks.
- Members can update only the `status` of tasks assigned to them.

## Railway Deployment

Deploy the server and client as separate Railway services.

### Server service

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `CLIENT_URL`
  - `NODE_ENV=production`

### Client service

- Root directory: `client`
- Build command: `npm install && npm run build`
- Start command: `npm run preview -- --port $PORT`
- Variables:
  - `VITE_API_URL=https://your-server-url.railway.app/api`

## Submission

- Live URL: add after Railway deployment
- GitHub Repository URL: add after pushing to GitHub
- Deployment link: add after Railway deployment
