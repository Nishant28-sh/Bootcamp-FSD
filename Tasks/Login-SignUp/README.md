# AuthFlow — Login & Signup Full Stack App

## Folder Structure
```
project/
├── backend/      → Express.js REST API
└── frontend/     → React + Vite UI
```

## Backend Setup
```bash
cd backend
npm install
npm run dev        # runs on http://localhost:8888
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev        # runs on http://localhost:5173
```

## API Endpoints
| Method | Route               | Auth     | Description        |
|--------|---------------------|----------|--------------------|
| POST   | /pages/register     | No       | Register new user  |
| POST   | /pages/login        | No       | Login user         |
| GET    | /pages/home         | No       | Public route       |
| GET    | /pages/dashboard    | JWT      | Protected route    |

## Bugs Fixed from Original
1. Case-mismatch in require() paths (Routes/ vs routes/, Controller/ vs controllers/)
2. auth.js crashed when Authorization header was missing
3. No validation on inputs
4. Secret key hardcoded (now in .env)
5. No start script in package.json
6. No proper HTTP status codes in responses
7. Switched bcrypt → bcryptjs (no native build needed)
