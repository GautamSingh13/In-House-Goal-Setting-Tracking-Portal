# ⚡ AtomQuest — In-House Goal Setting & Tracking Portal

> Built for **AtomQuest Hackathon 1.0** by Atomberg | May 2026

A full-stack MERN web application for managing employee goals, quarterly check-ins, and performance tracking — with role-based access for Employees, Managers, and Admins.

---

## 🚀 Live Demo

| Resource | Link |
|---|---|
| 🌐 Live Portal | [https://in-house-goal-setting-tracking-port-orpin.vercel.app/](https://in-house-goal-setting-tracking-port-orpin.vercel.app/) |
| 🔧 Backend API | [https://in-house-goal-setting-tracking-portal.onrender.com](https://in-house-goal-setting-tracking-portal.onrender.com) |

---

## 🔐 Test Credentials

| Role | Email | Password |
|---|---|---|
| Employee | employee@atomquest.com | employee123 |
| Manager (L1) | manager@atomquest.com | manager123 |
| Admin / HR | admin@atomquest.com | admin123 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Routing | React Router DOM |
| State Management | React Context API |
| HTTP Client | Axios + Interceptors |
| Backend | Node.js + Express.js |
| Authentication | JWT + bcryptjs |
| Database | MongoDB Atlas + Mongoose |
| Frontend Host | Vercel (Free) |
| Backend Host | Render (Free) |
| Database Host | MongoDB Atlas M0 — Mumbai |

---

## 👥 User Roles

### Employee
- Create, edit, and delete draft goals
- Set Thrust Area, Title, UoM, Target, Weightage
- Submit goals for manager approval
- Log quarterly achievements (Q1–Q4)
- View overall progress and goal-wise breakdown

### Manager (L1)
- Review submitted goals
- Inline edit target, weightage, description
- Approve or return goals with comments
- View team check-ins (Planned vs Actual)
- Add structured check-in comments per quarter

### Admin / HR
- Unlock approved/locked goals
- Delete any goal
- View all users and their goals
- Completion Dashboard — who submitted check-ins
- Audit Trail — all post-lock changes with timestamps

---

## ✅ Features

### Phase 1 — Goal Creation & Approval
- Goal creation with Thrust Area, Title, UoM (Numeric, %, Timeline, Zero-based), Target, Weightage
- Validation: max 8 goals, min 10% weightage per goal, total must equal 100%
- Manager L1 approval workflow: approve, inline edit, or return with comment
- Goals locked on approval — no edits without Admin intervention
- Goal editing allowed for draft and returned goals

### Phase 2 — Quarterly Check-ins & Tracking
- Employee quarterly check-in for Q1, Q2, Q3, Q4
- Status selection: Not Started, On Track, Completed
- System-computed progress scores (Numeric/%, Timeline, Zero-based)
- Manager check-in module with structured comments
- Quarterly window schedule enforced (Demo Mode available)

### Reporting & Governance
- CSV export: Planned Target vs Actual Achievement
- Completion Dashboard: real-time check-in status per employee
- Audit Trail: logs all post-lock changes — who, what, when

### UI & Experience
- Professional theme switcher: Orange, Blue, Dark Maroon
- Role-based navigation and protected routes
- Real-time weightage progress bar with validation warnings
- Toast notifications for all user actions

---

## 📁 Project Structure

```
atomquest/
├── client/                  ← React Frontend
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── EmployeeDashboard.jsx
│       │   ├── ManagerDashboard.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── Goals.jsx
│       │   ├── CheckIn.jsx
│       │   ├── Progress.jsx
│       │   └── Reports.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── GoalCard.jsx
│       │   ├── GoalForm.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── services/
│           └── api.js
└── server/                  ← Node.js + Express Backend
    ├── models/
    │   ├── User.js
    │   ├── Goal.js
    │   └── AuditLog.js
    ├── controllers/
    │   ├── authController.js
    │   ├── goalController.js
    │   └── userController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── goalRoutes.js
    │   └── userRoutes.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── config/
    │   └── db.js
    └── server.js
```

---

## 📊 Progress Score Formulas

| UoM Type | Formula |
|---|---|
| Numeric / % | min(round(Actual / Target × 100), 100) |
| Zero-based | Actual = 0 → 100%, else 0% |
| Timeline | Actual ≤ Target → 100%, else 0% |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### Backend Setup
```bash
cd server
npm install
```

Create `.env` file in `server/`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
DEMO_MODE=true
```

```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`

---

## 💰 Cost Optimization

Entire infrastructure runs on **free tiers**:
- **Vercel** — Frontend CDN, global deployment
- **Render** — Backend Node.js runtime
- **MongoDB Atlas M0** — 512MB cloud database, Mumbai region

**Total monthly cost: $0**

---

*Built by Gautam Singh for AtomQuest Hackathon 1.0 — May 2026*
