# Employee Management System

A full-stack Employee Management application built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## Project Structure

```
employee-management/
├── backend/                    # Express REST API
│   ├── config/                 # DB connection & app config
│   ├── controllers/            # Route handler logic
│   ├── middleware/             # Custom Express middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express route definitions
│   ├── utils/                  # Helper utilities
│   ├── .env                    # ⚠️  Not committed — local secrets
│   ├── .env.example            # ✅  Safe template to copy from
│   ├── .gitignore
│   ├── package.json
│   └── server.js               # App entry point
│
├── frontend/                   # React + Vite SPA
│   ├── public/                 # Static assets
│   └── src/
│       ├── api/                # Axios instance & API calls
│       ├── assets/             # Images, fonts, icons
│       ├── components/         # Reusable UI components
│       ├── pages/              # Route-level page components
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│   ├── .env                    # ⚠️  Not committed — local secrets
│   ├── .env.example            # ✅  Safe template to copy from
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore                  # Root-level catch-all
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
cp .env.example .env        # Fill in your MongoDB URI & secrets
npm install
npm run dev                 # Starts on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env        # Adjust VITE_API_URL if needed
npm install
npm run dev                 # Starts on http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                      | Default          |
|----------------|----------------------------------|------------------|
| `NODE_ENV`     | Runtime environment              | `development`    |
| `PORT`         | Server port                      | `5000`           |
| `MONGODB_URI`  | MongoDB connection string        | —                |
| `CORS_ORIGIN`  | Allowed frontend origin          | `http://localhost:5173` |
| `JWT_SECRET`   | JWT signing secret               | —                |
| `JWT_EXPIRES_IN` | JWT token expiry               | `7d`             |
| `LOG_LEVEL`    | Morgan log format                | `dev`            |

### Frontend (`frontend/.env`)

| Variable         | Description                | Default                          |
|------------------|----------------------------|----------------------------------|
| `VITE_API_URL`   | Backend API base URL       | `http://localhost:5000/employees` |
| `VITE_APP_NAME`  | Application display name   | `Employee Management System`     |
| `VITE_APP_VERSION` | App version              | `1.0.0`                          |

---

## Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 18, Vite, Axios          |
| Backend   | Node.js, Express 4             |
| Database  | MongoDB, Mongoose              |
| Dev Tools | Nodemon, ESLint, Oxlint        |
