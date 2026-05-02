# Pro Task Manager

A full-stack, neon-styled team task manager with MongoDB, Express, React 18, and Tailwind + ShadCN UI. It ships with JWT auth, role-based project access, and a Kanban workflow.

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Zod
- **Frontend:** Vite + React 18, Tailwind CSS, ShadCN-style components, Framer Motion, Zustand

## Getting started

### 1) Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**Environment variables** (`backend/.env`)

- `PORT` - API port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret used to sign JWTs
- `JWT_EXPIRES_IN` - token expiry (default: 7d)
- `CORS_ORIGIN` - frontend URL (default: http://localhost:5173)

### 2) Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

**Environment variables** (`frontend/.env`)

- `VITE_API_URL` - API base URL (default: http://localhost:5000/api)

## API overview

### Auth

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Current user

### Users

- `GET /api/users` - List users (admin only)
- `GET /api/users/:id` - Get user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Projects

- `GET /api/projects` - List projects for the user
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Project details
- `PATCH /api/projects/:id` - Update project (owner/admin)
- `DELETE /api/projects/:id` - Delete project (owner)
- `POST /api/projects/:id/members` - Add member (owner/admin)
- `PATCH /api/projects/:id/members/:memberId` - Update member role (owner/admin)
- `DELETE /api/projects/:id/members/:memberId` - Remove member (owner/admin)

### Tasks

- `GET /api/projects/:projectId/tasks` - List tasks
- `POST /api/projects/:projectId/tasks` - Create task (owner/admin)
- `GET /api/projects/:projectId/tasks/:taskId` - Task details
- `PATCH /api/projects/:projectId/tasks/:taskId` - Update task
- `DELETE /api/projects/:projectId/tasks/:taskId` - Delete task (owner/admin)

## Notes

- Project roles: `owner`, `admin`, `member`
- Task statuses: `todo`, `in_progress`, `review`, `done`
- Task priorities: `low`, `medium`, `high`
