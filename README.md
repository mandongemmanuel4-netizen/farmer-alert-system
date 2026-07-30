# FSDAMS — Farm Safety & Distress Alert Management System
Final Year Project — Gombe State University | Deadline: Aug 30, 2026

## Structure
```
farmer-alert-system/
├── backend/                  Node.js + Express API
│   ├── models/                Mongoose schemas (11 collections)
│   ├── controllers/           Business logic
│   ├── routes/                API endpoints
│   ├── middleware/            Auth (JWT) + RBAC + ward-scoping
│   ├── config/                DB connection, Twilio client
│   ├── jobs/                  node-cron: reminders, timeout detection
│   ├── .env.example           Copy to .env and fill in real credentials
│   └── server.js               Entry point
│
└── frontend/                 React (Vite) + Tailwind, 3 portals as 1 PWA
    ├── src/pages/
    │   ├── farmer/             13 screens (register, check-in, farms, contacts...)
    │   ├── coordinator/        8 screens (dashboard, live map, alerts...)
    │   ├── admin/               11 screens (states/LGAs/wards, CSOs, settings...)
    │   └── shared/              Login
    ├── src/context/AuthContext.jsx   Login state, shared across all portals
    ├── src/routes/ProtectedRoute.jsx  Enforces /farmer/*, /coordinator/*, /admin/*
    └── src/services/api.js       Axios client, auto-attaches JWT
```

## Setup (run these once you have MongoDB Atlas + Twilio credentials)

### Backend
```
cd backend
npm install
cp .env.example .env      # then fill in MONGO_URI, JWT_SECRET, TWILIO_* keys
npm run dev                # starts on http://localhost:5000
```

### Frontend
```
cd frontend
npm install
npm run dev                # starts on http://localhost:5173
```

## Status
- [x] Full DB schema (11 models) matching admin/CSO/farmer spec
- [x] PIN-based auth (register, login, change PIN) with RBAC middleware
- [x] Frontend scaffold: routing for all 33 screens across 3 portals
- [ ] Farmer registration flow (steps 1–2, farms, contacts)
- [ ] Check-in/check-out + timeout detection cron
- [ ] Twilio SMS integration
- [ ] Coordinator dashboard + live map
- [ ] Admin dashboard + location management
- [ ] PWA offline support
- [ ] Deployment (Vercel + Render)

See `project-roadmap.md` for the full week-by-week plan.
