# ⚡ TaskFlow — MERN Project Management Tool

A full-stack collaborative project management app like Trello/Asana built with the **MERN stack**.

---

## 🚀 Features

- 🔐 **Auth System** — JWT access + refresh tokens, bcrypt passwords, protected routes
- 📋 **Kanban Boards** — Drag-and-drop task cards across columns
- ✅ **Task Management** — Assign members, set priorities, due dates, subtasks/checklist
- 💬 **Comments** — Threaded comments with @mention support, activity log
- 👥 **Team Workspaces** — Invite members, role-based access (Admin / Member / Viewer)
- 🔔 **Notifications** — In-app bell, real-time via Socket.io
- ⚡ **Real-time Updates** — Socket.io rooms per board, live card moves
- 🌙 **Dark / Light Theme** — Full theme toggle with CSS variables
- 🔍 **Search & Filters** — Filter by assignee, priority, due date, status

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Drag & Drop | @dnd-kit |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh) + bcrypt |
| Real-time | Socket.io |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer |

---

## 📁 Folder Structure

```
taskflow/
├── server/                  # Express API
│   ├── config/
│   │   ├── db.js            # MongoDB connection
│   │   └── passport.js      # OAuth config
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   ├── task.controller.js
│   │   ├── comment.controller.js
│   │   └── notification.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verify
│   │   ├── role.middleware.js   # RBAC
│   │   └── upload.middleware.js # Multer
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Project.model.js
│   │   ├── Task.model.js
│   │   ├── Comment.model.js
│   │   └── Notification.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   ├── task.routes.js
│   │   ├── comment.routes.js
│   │   └── notification.routes.js
│   ├── sockets/
│   │   ├── socketManager.js    # Socket.io setup
│   │   └── events.js           # Event name constants
│   ├── utils/
│   │   ├── email.js            # Nodemailer helpers
│   │   └── token.js            # JWT helpers
│   ├── server.js               # Entry point
│   ├── .env.example
│   └── package.json
│
├── client/                  # React + Vite
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js         # Axios instance + interceptors
│   │   │   ├── auth.api.js
│   │   │   ├── project.api.js
│   │   │   ├── task.api.js
│   │   │   └── comment.api.js
│   │   ├── components/
│   │   │   ├── board/
│   │   │   │   ├── KanbanBoard.jsx
│   │   │   │   ├── Column.jsx
│   │   │   │   └── TaskCard.jsx
│   │   │   ├── task/
│   │   │   │   ├── TaskModal.jsx
│   │   │   │   ├── CommentThread.jsx
│   │   │   │   └── ActivityLog.jsx
│   │   │   └── layout/
│   │   │       ├── Sidebar.jsx
│   │   │       ├── Navbar.jsx
│   │   │       └── NotifBell.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── hooks/
│   │   │   ├── useSocket.js
│   │   │   ├── useAuth.js
│   │   │   └── useNotifications.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProjectBoard.jsx
│   │   │   └── Settings.jsx
│   │   ├── store/
│   │   │   ├── useProjectStore.js
│   │   │   └── useTaskStore.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json             # Root (concurrently)
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone <your-repo>
cd taskflow
npm run install:all
```

### 2. Configure Environment
```bash
cp server/.env.example server/.env
# Fill in your MongoDB URI, JWT secrets, etc.
```

### 3. Run Development
```bash
npm run dev
# Server: http://localhost:5000
# Client: http://localhost:5173
```

---

## 🔑 Environment Variables (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
GOOGLE_CLIENT_ID=optional
GOOGLE_CLIENT_SECRET=optional
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, returns tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate refresh token |
| GET  | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/projects` | Get all user projects |
| POST | `/api/projects` | Create project |
| GET  | `/api/projects/:id` | Get project by ID |
| PUT  | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/invite` | Invite member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/tasks?project=:id` | Get project tasks |
| POST | `/api/tasks` | Create task |
| GET  | `/api/tasks/:id` | Get task by ID |
| PUT  | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/move` | Move task column |
| DELETE | `/api/tasks/:id` | Delete task |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/comments?task=:id` | Get task comments |
| POST | `/api/comments` | Add comment |
| DELETE | `/api/comments/:id` | Delete comment |

---

## 🔌 Socket.io Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `join-board` | Client → Server | `{ boardId }` |
| `task-moved` | Server → Client | `{ taskId, fromCol, toCol }` |
| `task-created` | Server → Client | `{ task }` |
| `task-updated` | Server → Client | `{ task }` |
| `comment-added` | Server → Client | `{ comment }` |
| `user-online` | Server → Client | `{ userId }` |

---

## 🚢 Deployment

- **Backend**: Railway / Render / Heroku
- **Frontend**: Vercel / Netlify
- **Database**: MongoDB Atlas (free tier)
- **Files**: Cloudinary (free tier)

---

## 🧑‍💻 Built for Resume

This project demonstrates:
- ✅ REST API design with Express
- ✅ MongoDB schema design with Mongoose
- ✅ JWT auth with refresh token rotation
- ✅ Role-based access control (RBAC)
- ✅ Real-time WebSockets with Socket.io
- ✅ React state management with Zustand
- ✅ Drag-and-drop with @dnd-kit
- ✅ Professional UI with Tailwind + shadcn/ui

---

*Made with ⚡ TaskFlow*
