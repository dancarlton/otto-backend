# 🧠 Otto Backend – API Reference

> This document outlines the API endpoints and upcoming feature roadmap for Otto AI's backend.

---

## 📬 API Endpoints

| Method | Endpoint               | Description                           |
|--------|------------------------|---------------------------------------|
| POST   | `/api/users/register`  | Register a new user                   |
| POST   | `/api/users/login`     | Authenticate user and return JWT      |
| GET    | `/api/preferences`     | Get the logged-in user's preferences  |
| POST   | `/api/preferences`     | Save or update user surf preferences  |
| GET    | `/api/forecast`        | Generate a GPT-based surf forecast    |

---

## 🧠 Future Plans

- 🌊 Integrate buoy data from the National Data Buoy Center
- 📍 Map buoy stations to user-selected surf spots
- 📈 Track and enforce GPT token usage per user
- 💳 Add Pro subscription tier with usage limits
- 📡 Send push notifications via Firebase when surf matches preferences
- 🛠 Admin dashboard for managing users and analytics
- 🔒 Add refresh tokens and secure session management
