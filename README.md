# NeoConnect — Staff Feedback & Complaint Management Platform

> A transparent, accountable platform where staff can raise issues, vote on polls, and see how management is responding.

© 2026 NeoConnect Technologies Inc. vijay

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local via [MongoDB Community](https://www.mongodb.com/try/download/community) or cloud via [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/neoconnect
JWT_SECRET=your-secret-key
```

Start the backend server:

```bash
npm run dev
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend dev server:

```bash
npm run dev
```

### 3. Open in Browser

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🏗️ Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Frontend   | Next.js 15, React, Tailwind CSS v4, shadcn/ui |
| Backend    | Node.js, Express.js                           |
| Database   | MongoDB + Mongoose                            |
| Auth       | JWT + bcrypt                                  |
| Charts     | Recharts                                      |
| Animations | Framer Motion                                 |
| Icons      | Lucide React                                  |
| Toasts     | Sonner                                        |

---

## 👥 User Roles

| Role             | Access                                                                        |
| ---------------- | ----------------------------------------------------------------------------- |
| **Staff**        | Submit complaints, track status, vote in polls, view public hub               |
| **Secretariat**  | View all cases, assign case managers, create polls, upload minutes, analytics |
| **Case Manager** | View assigned cases, update status, add notes, close cases                    |
| **Admin**        | Manage users, edit roles, security settings                                   |

---

## ✨ Key Features

- 🎯 **Tracking ID**: Auto-generated `NEO-YYYY-NNN` format for every complaint
- 🔒 **Anonymous Submissions**: Staff can hide their identity when raising issues
- ⏰ **7-Day Auto-Escalation**: Unresponded cases escalate automatically to management
- 📊 **Analytics Dashboard**: Charts by department, category, status + hotspot detection
- 🗳️ **Organization-wide Polling**: One vote per user, results shown as live charts
- 🛡️ **Security Settings**: Admin-configurable password policies, JWT expiry, CORS, rate limiting (persisted in MongoDB)
- 🌐 **Public Hub**: Resolved cases visible to all staff for transparency
- 📄 **Document Management**: Upload and manage meeting minutes
- 🌓 **Premium Dark UI**: Glassmorphism, smooth animations, responsive design
- 🖼️ **Custom Branding**: Custom logo support across all pages

---

## 📁 Project Structure

```
AGP1/
├── backend/               # Express.js API server
│   ├── src/
│   │   ├── config/        # Database connection
│   │   ├── controllers/   # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── caseController.js
│   │   │   ├── pollController.js
│   │   │   ├── analyticsController.js
│   │   │   └── settingsController.js
│   │   ├── middleware/    # Auth & role guard
│   │   ├── models/        # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Case.js
│   │   │   ├── Poll.js
│   │   │   ├── Vote.js
│   │   │   ├── Document.js
│   │   │   └── Setting.js
│   │   ├── routes/        # API endpoints
│   │   │   ├── auth.js
│   │   │   ├── cases.js
│   │   │   ├── polls.js
│   │   │   ├── documents.js
│   │   │   ├── analytics.js
│   │   │   └── settings.js
│   │   ├── utils/         # Helpers (tracking ID, escalation)
│   │   └── server.js      # Entry point
│   └── .env
│
├── frontend/              # Next.js app
│   ├── public/            # Static assets & logo
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   │   ├── page.js              # Landing page
│   │   │   ├── login/page.js        # Login
│   │   │   ├── register/page.js     # Registration
│   │   │   └── dashboard/           # Role-based dashboards
│   │   │       ├── layout.js        # Sidebar & navigation
│   │   │       ├── staff/           # Staff pages
│   │   │       ├── secretariat/     # Secretariat pages
│   │   │       ├── case-manager/    # Case manager pages
│   │   │       └── admin/           # Admin pages
│   │   ├── components/    # UI components (shadcn/ui)
│   │   └── lib/           # API client, auth context
│   └── .env.local
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

| Method | Route                     | Description                | Auth |
| ------ | ------------------------- | -------------------------- | ---- |
| POST   | `/api/auth/register`      | Register new user          | No   |
| POST   | `/api/auth/login`         | Login & get JWT            | No   |
| GET    | `/api/auth/me`            | Get current user           | Yes  |
| GET    | `/api/auth/users`         | Get all users (admin)      | Yes  |
| PUT    | `/api/auth/users/:id/role`   | Update user role        | Yes  |
| PUT    | `/api/auth/users/:id/status` | Toggle user status      | Yes  |

### Cases

| Method | Route                     | Description              | Auth |
| ------ | ------------------------- | ------------------------ | ---- |
| POST   | `/api/cases`              | Submit complaint         | Yes  |
| GET    | `/api/cases`              | All cases (secretariat)  | Yes  |
| GET    | `/api/cases/my`           | My complaints (staff)    | Yes  |
| PUT    | `/api/cases/:id/assign`   | Assign case manager      | Yes  |
| PUT    | `/api/cases/:id/status`   | Update status            | Yes  |

### Polls

| Method | Route                     | Description              | Auth |
| ------ | ------------------------- | ------------------------ | ---- |
| GET    | `/api/polls`              | Get all polls            | Yes  |
| POST   | `/api/polls`              | Create poll              | Yes  |
| POST   | `/api/polls/:id/vote`     | Vote on poll             | Yes  |

### Analytics & Settings

| Method | Route                     | Description              | Auth |
| ------ | ------------------------- | ------------------------ | ---- |
| GET    | `/api/analytics/overview` | Dashboard statistics     | Yes  |
| GET    | `/api/settings`           | Get security settings    | Yes  |
| PUT    | `/api/settings`           | Update security settings | Yes  |

---

## 🔑 Environment Variables

**Backend** (`.env`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/neoconnect
JWT_SECRET=your-secret-key
```

**Frontend** (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📸 Pages Overview

| Page               | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `/`                | Landing page with features, security, and CTA        |
| `/login`           | Premium glassmorphic sign-in                         |
| `/register`        | Account creation with role selection                 |
| `/dashboard/staff` | Staff home — submit complaints, track, vote, hub     |
| `/dashboard/secretariat` | Case inbox, analytics, polls, minutes          |
| `/dashboard/case-manager` | Assigned cases management                     |
| `/dashboard/admin` | User management, security settings                   |

---

## 📜 License

© 2026 NeoConnect Technologies Inc. vijay
