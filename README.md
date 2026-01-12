# Bookent – Event Booking Platform

**Bookent** is a full-stack event booking and management platform built with real-world business logic, secure payments, and scalable architecture.

---

## Features

### Users

- Email OTP & Google SSO authentication
- Event discovery & booking
- Real-time seat locking with expiry
- Secure checkout (Ticket + Platform Fee + GST)
- PayPal payments
- QR code tickets & verification
- Wallet, coupons & invoice downloads (PDF)

### Organizers

- Event & stadium management (CRUD)
- Organizer dashboard & analytics
- Sales reports (Daily / Weekly / Yearly / Custom range)
- Refund requests & booking insights
- Top-performing events view

### Admin

- User & organizer management
- Organizer approval workflows
- Coupon & banner management
- Refund & wallet transaction management
- Platform sales reports & dashboards
- Report exports (PDF / Excel / CSV)

---

## Business Logic

- **Platform-funded coupons**
- **Revenue separation** (Platform vs Organizer)

- Refunds affect **ticket price only**, not platform fees

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Recharts
- **Backend:** Node.js, Express, MongoDB
- **Auth:** JWT, Email OTP, Google OAuth
- **Payments:** PayPal
- **Storage:** AWS S3
- **Realtime:** Redis (Pub/Sub), Socket.IO

---

## Redis Pub/Sub

Used alongside Socket.IO backend events for:

- Seat locking & automatic expiry
- Real-time booking state updates
- Event-driven communication at scale

---

## Realtime Updates (Socket.IO)

Provides immediate seat lock and unlock updates to connected clients via WebSocket connections, ensuring low-latency synchronization of seat availability during bookings.

---

## Security

- Helmet (CSP & secure headers)
- Rate limiting
- Secure OTP generation (crypto)
- Zod-based request validation
- Role-based access control
- JWT blacklist for secure logout and token invalidation
- Environment variable schema validation for safe configuration

---

## Code Quality & Tooling

- ESLint for maintaining consistent code style and identifying potential issues early in the development process
- Prettier for automatic code formatting to ensure uniformity across the codebase
- Docker for containerized development and deployment, enabling consistent environments and simplified scalability
- Robust logging implemented with Winston to facilitate monitoring, debugging, and audit trails
- Centralized environment configuration with schema validation to prevent misconfiguration across environments

---

## Analytics & Reports

- Admin & Organizer dashboards
- Revenue, orders, refunds & users analytics
- Export support (PDF / Excel / CSV)

---

## Summary

Bookent is a **production-grade ticketing platform** showcasing secure authentication, real-time concurrency handling, accurate financial reporting, and scalable system design.
