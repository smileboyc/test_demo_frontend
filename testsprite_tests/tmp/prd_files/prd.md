# Product Requirements Document (PRD)

## 1. Overview

Build a platform for searching, booking, and reviewing hotels or flights. Users can search, book, and review using local data. Uses a basic email/password authentication system with a hardcoded test account (example@gmail.com, password 123456789). Backend is Node.js with local storage. No external services required.

---

## 2. User Stories

### 2.1. As a User (with test account)
- I can log in using the test account (example@gmail.com, password 123456789).
- I can search for hotels/flights (local data).
- I can book a hotel/flight (simulate booking).
- I can leave and view reviews.
- I can view my booking history.

---

## 3. Functional Requirements

- User authentication (hardcoded test account: example@gmail.com / 123456789)
- Search hotels/flights (local data)
- Book hotel/flight (simulate)
- Leave/view reviews
- View booking history
- Backend: Node.js/Express, local JSON/in-memory storage
- Frontend: React

---

## 4. Non-Functional Requirements

- Runs locally with minimal setup
- No external services
- Simple, clean UI

---

## 5. Deliverables

- React frontend
- Node.js backend
- Local data storage
- README with setup instructions 