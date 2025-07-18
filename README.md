# 🧠 Otto Backend – API Reference

> This document outlines the API endpoints, setup instructions, and roadmap for Otto AI's backend.

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

## 🚀 Getting Started

### 1. Clone the Repo

```
git clone https://github.com/yourusername/otto-backend.git
cd otto-backend
```

### 2. Install Dependencies

```
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

- `MONGODB_URI`
- `OPENAI_API_KEY`
- `JWT_SECRET`

```
cp .env.example .env
```

### 4. Start the Development Server

```
npm run dev
```

Backend will run on `http://localhost:3001`.

---

## 📁 Project Structure
```
otto-backend/
├── controllers/       → Route handlers (auth, GPT, preferences)
├── errors/            → Centralized error classes
├── middlewares/       → Rate limiter, error handling, logging
├── models/            → Mongoose schemas (User, SurfSpot)
├── routes/            → API routes
├── utils/             → Custom helpers (e.g., geo logic, GPT helpers)
├── app.js             → App configuration and route mounting
├── server.js          → Entry point for starting the server
```
---

## 🧰 Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- OpenAI GPT-3.5
- Celebrate + Joi
- JWT Auth
- dotenv
- Helmet + CORS
- Winston logging

---

## 🔒 Rate Limiting

Rate limiter is configured in `/middlewares/rate-limiter.js`.

- Limits each IP to 100 requests per 15 min
- Used globally in `app.js`

---

## 🧠 GPT Prompting Flow

1. Extracts location (e.g., "Malibu") from user message using GPT.
2. Geocodes location via OpenStreetMap.
3. Finds nearest surf spot and buoy station.
4. Fetches live NOAA data (wave height, wind, etc).
5. Constructs prompt with user prefs + live data.
6. Sends to GPT and returns full reply + JSON forecast.

---

## 🧪 Testing the API

- Launch MongoDB and backend server.
- Use Postman or frontend to test:
  - Register/login → store JWT
  - Save preferences via POST `/api/preferences`
  - Ask Otto via GET `/api/forecast` with query param `message=...`
- Ensure `.env` is properly set

---

## 🔮 Future Plans

- 🌊 Expand buoy coverage + NOAA parsing
- 📍 Pin surf spots and match buoys
- 📈 Track GPT token usage per user
- 💳 Pro tier with usage limits
- 📡 Push notifications via Firebase
- 🛠 Admin panel for analytics
- 🔒 Refresh tokens and session security

---
