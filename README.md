# To-Do Application

Full-stack To-Do app with authentication and role-based access control.

**Stack:** Angular 20 + AdonisJS 6 + PostgreSQL + Docker

---

## Quick Start

Clone the repository and start the application:

```bash
git clone https://github.com/webDevYuri/technical-exam.git
cd technical-exam
docker compose --profile production up --build
```

**Access:**
- Frontend: http://localhost
- Backend API: http://localhost:3333

**Test Credentials:**

| Email             | Password | Role    |
|-------------------|----------|---------|
| admin@example.com | password | Admin   |
| user@example.com  | password | Regular |

---

## Development Setup

Clone the repository:

```bash
git clone https://github.com/webDevYuri/technical-exam.git
cd technical-exam
```

**Prerequisites:**
- Node.js 20+
- PostgreSQL 16
- Angular CLI

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env  # Configure database credentials
node ace migration:run
node ace db:seed
npm run dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
ng serve
```

**Database Only (Docker):**
```bash
docker compose up postgres
```

---
