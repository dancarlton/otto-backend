# 🌊 Otto – Your Personalized Surf Reporter

Otto is a custom-built React application that allows surfers to stay on top of the best wave conditions based on their personal preferences. Whether you're chasing morning glass or avoiding choppy onshore winds, Otto notifies you when the surf is just right near you.

## 📦 Stack

- **Frontend:** React (with React Router)
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Auth:** JWT
- **Notifications:** Firebase Cloud Messaging

---

## 🔌 APIs Used

- **[OpenAI API](https://platform.openai.com/docs)**  
  Used to generate personalized surf reports based on each user's saved preferences using GPT-4o.  
  - Token usage is tracked per user
  - A free limit is enforced unless the user upgrades to Pro

- **[Stormglass.io](https://stormglass.io/)** *(Planned for future release)*  
  Will be used for real-time marine weather data like wave height, tide, and wind direction.  
  - Currently excluded from the MVP due to pricing

---

## 🚀 Features

- 🌐 User registration and login (JWT)
- 🌊 Surf preference setup (ideal wave height, wind, swell, tide, etc.)
- 📍 Favorite surf spots by location
- 📡 Real-time surf forecast using Stormglass API
- 🔔 Push notifications when conditions match preferences
- 🧠 Optional GPT integration for surf spot suggestions (coming soon)

---

## 🧪 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/otto.git
cd otto-backend
```