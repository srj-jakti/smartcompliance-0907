# SmartCompliance — Feature Expansion

## What to build:
1. **Multi-tenant isolation** — each CA firm is a "firm". All data scoped by firmId
2. **Employee role** — employees belong to a CA firm, have own dashboard
3. **3 login roles**: ca (owner), employee (staff), client
4. **Chat system** — CA↔Client and CA/Employee↔Client real-time chat
5. **Work assignment** — CA assigns tasks+clients to employees
6. **AI Auto-assign** — toggle ON: AI assigns tasks to best-fit employee, notifies CA
7. **Employee dashboard** — shows only their assigned tasks/clients

## Architecture:
- firmId on every record (clients, tasks, invoices, etc.)
- employees table: firmId, role (manager/staff), assignedClientIds
- chats table: messages between users, scoped by firmId
- auth: 3 roles: ca_owner, employee, client — stored in localStorage

## Demo Data (2 isolated firms):
- Firm 1: CA Rajesh (ca1@demo.in / ca123), Employee Priya (emp1@demo.in / emp123), Client Rajesh Kumar (client@demo.in / client123)
- Firm 2: CA Priya Mehta (ca2@demo.in / ca123) — totally separate data

## Pages to build:
- Login: 3 role selector (CA, Employee, Client)
- Employee dashboard: my tasks, my clients, chat, attendance
- CA: team management page with assign + AI-auto-assign toggle
- Chat: real-time-like chat UI between CA/employee and client
- API: firm-scoped all endpoints, chat CRUD, employee CRUD

## Status: IN PROGRESS
