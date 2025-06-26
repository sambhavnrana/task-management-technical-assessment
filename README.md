# Task Management System

A full-stack task management system with user authentication and CRUD operations, built with Node.js, Express, TypeScript, PostgreSQL, React, and Tailwind CSS.

---

## Features

- User registration and login (JWT authentication)
- Secure password hashing (bcrypt)
- CRUD operations for tasks
- Filter and sort tasks by status, priority, or date
- Responsive, modern UI with Tailwind CSS

---

## Setup Instructions

### 1. **Clone the repository**

```sh
git clone https://github.com/sambhavnrana/task-management-technical-assessment
cd task-management
```

### 2. **Backend Setup**

```sh
cd backend
npm install
```

#### **Environment Variables**

Create a `.env` file in the `backend` directory:

```
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/taskdb
JWT_SECRET=your_jwt_secret
PORT=4000
```

#### **Database Setup**

Start PostgreSQL and create the database and tables:

```sql
CREATE DATABASE taskdb;
\c taskdb

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Run the Backend**

```sh
npm run dev
```

The backend will run on [http://localhost:4000](http://localhost:4000)

---

### 3. **Frontend Setup**

```sh
cd ../frontend
npm install
```

#### **Vite Proxy Setup**

Edit `vite.config.ts` to add:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:4000',
  },
},
```

#### **Run the Frontend**

```sh
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173)

---

## API Documentation

### **Authentication**

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/profile` — Get current user profile (protected)

#### **Request/Response Examples**

**Register:**

```json
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

**Login:**

```json
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Create Task:**

```json
POST /api/tasks
{
  "title": "My Task",
  "description": "Details...",
  "status": "pending",
  "priority": "medium"
}
```

**Authorization:**
All protected routes require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Assumptions

- The backend and frontend run on separate ports during development.
- The JWT secret is kept secure and consistent between sign/verify.
- PostgreSQL is running locally and accessible at the default port at your machine.
- The user creates the database and tables as shown above.
- The frontend uses Vite's proxy to avoid CORS issues in development.
