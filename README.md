# NeoConnect — Staff Feedback & Complaint Management Platform
🌐 **Live Demo:** [https://neo-connect.netlify.app](https://neo-connect.netlify.app)
> A transparent, accountable platform where staff can raise issues, vote on polls, and see how management is responding.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens)](https://jwt.io/)

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

## 🌍 Deployment Guide

The NeoConnect platform is designed to be easily deployed to modern cloud providers.

### 1. Deploying the Backend (Render / Railway / Heroku)

The Node.js/Express backend requires a MongoDB database to run.

1. **Database Setup**: Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas). Get your connection string.
2. **Hosting**: Create a new Web Service on Render or Railway.
3. **Repository**: Connect your GitHub repository.
4. **Root Directory**: Set the root directory for this service to `backend`.
5. **Environment Variables**: Add the following securely in your hosting dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A strong, randomly generated string for secure authentication.
   - `PORT`: Leave blank or set to `5000` (cloud providers usually inject their own).
6. **Commands**:
   - Build Command: `npm install`
   - Start Command: `npm start`
7. **Deploy** and copy your live backend URL (e.g., `https://neoconnect-api.onrender.com/api`).

### 2. Deploying the Frontend (Vercel / Netlify)

The Next.js frontend is heavily optimized for platforms like Vercel and Netlify.

**Option A: Vercel (Recommended)**
1. Go to [Vercel](https://vercel.com) and click **Add New Project**.
2. **Repository**: Import your GitHub repository.
3. **Root Directory**: Click "Edit" and change to `frontend`.
4. **Framework Preset**: Ensure it is set to **Next.js**.
5. **Environment Variables**: Add `NEXT_PUBLIC_API_URL` with your live backend URL (e.g., `https://neoconnect-api.onrender.com/api`).
6. **Deploy**.

**Option B: Netlify**
1. Go to [Netlify](https://app.netlify.com) and click **Add new site** > **Import an existing project**.
2. **Repository**: Connect your GitHub and select the `neo-connect2.0` repository.
3. **Base directory**: Set this to `frontend`. Note: Netlify will automatically detect Next.js.
4. **Build command**: Should auto-populate to `npm run build`.
5. **Publish directory**: Should auto-populate to `.next`.
6. Click **Show advanced** and add an **Environment variable**:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your live backend URL (e.g., `https://neoconnect-api.onrender.com/api`).
7. Click **Deploy site**.

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

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) for details on how to fork, branch, and submit pull requests.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

Copyright © 2026 Nitish
