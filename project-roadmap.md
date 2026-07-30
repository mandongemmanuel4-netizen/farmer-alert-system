# Farmer Security & Distress Alert System — Roadmap (v2, full spec)
**Deadline:** August 30, 2026 | **Today:** July 11, 2026 (~7 weeks)
**Roles:** Farmer, Coordinator, Administrator | **Auth:** Phone + 4-digit PIN

---

## Week 1 (Jul 11–17): Foundation
- Project structure, Git, MongoDB Atlas, Twilio accounts
- Full schema: Users, States, LGAs, Wards, Villages, FarmLocations, EmergencyContacts,
  CheckIns, LocationHistory, Alerts, SecurityPosts, ActivityLogs
- Seed data: Nigerian states/LGAs/wards (at least Plateau State fully, others minimal)
- PIN-based JWT auth (register/login, RBAC middleware for farmer/coordinator/admin)

## Week 2 (Jul 18–24): Farmer Core
- Registration flow (5 steps: personal info → location → PIN → farms → 3 emergency contacts)
- Farm management (add/edit multiple farms with GPS)
- Farmer dashboard shell (React Router, role-protected routes)

## Week 3 (Jul 25–31): Check-in / Distress Engine
- Check-in / check-out API + expected return time
- Reminder notification job (before expected return)
- Timeout detection cron → auto alert creation
- Panic button endpoint (manual alert, instant)
- LocationHistory ping every few minutes while checked in

## Week 4 (Aug 1–7): SMS + Alerts
- Twilio integration: alert to 3 contacts + coordinator + nearest security post
- Alert lifecycle: created → sent → coordinator resolves + adds notes
- ActivityLogs for key actions

## Week 5 (Aug 8–14): Coordinator + Admin Dashboards
- Coordinator: live map, active farmers (ward-scoped only), alerts, resolve alert, reports
- Admin: user management, ward/security post management, SMS/reminder settings, logs, reports
- RBAC enforcement tested (coordinator can't see other wards, farmer can't reach admin routes)

## Week 6 (Aug 15–19): Frontend Polish + PWA
- Farmer UI: check-in/out, panic button, farm & contact management, history — mobile-first, low-literacy friendly
- PWA: offline check-in queue, service worker, background sync
- Live map (Google Maps API) on coordinator dashboard

## Week 7 (Aug 20–24): Testing, Deploy, Docs
- Usability test: simulate check-in, timeout, panic button, offline mode
- Deploy: frontend → Vercel, backend → Render
- Measure alert response time
- Start Chapters 1–3 & 5 writeup

## Aug 25–29: Finish documentation + defense prep
## Aug 30: Submission 🎯

### Scope-cut list (only if time runs short, in this order)
1. Admin reports/analytics polish → keep functional, skip charts
2. ActivityLogs UI → keep DB logging, skip a full logs viewer
3. Multi-state seed data → fully seed Plateau State only, stub others
4. Live map real-time refresh → poll every 30s instead of live sockets
Never cut: check-in/out, panic button, timeout alert, SMS delivery, RBAC.
