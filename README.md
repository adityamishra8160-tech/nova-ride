# ⚡ Nova Ride Easily — MERN Stack App

A full-featured car booking web application built with MongoDB, Express.js, React, and Node.js.

---

## 📁 Project Structure

```
nova-ride/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Car.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cars.js
│   │   ├── bookings.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── CarCard.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── Cars.js
    │   │   ├── BookRide.js
    │   │   ├── Payment.js
    │   │   ├── MyBookings.js
    │   │   └── AdminPanel.js
    │   ├── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB running locally on port 27017
- npm or yarn

---

### Step 1 — Start MongoDB

Make sure MongoDB is running:
```bash
# macOS/Linux
mongod

# Windows (if installed as service, it should auto-start)
# Or run: mongod --dbpath C:\data\db
```

---

### Step 2 — Setup Backend

```bash
cd nova-ride/backend
npm install
node server.js
```

The backend will:
- Connect to MongoDB
- Seed **15 default cars** automatically
- Start on **http://localhost:5000**

---

### Step 3 — Setup Frontend

Open a new terminal:

```bash
cd nova-ride/frontend
npm install
npm start
```

The React app will start on **http://localhost:3000**

---

## 🔑 Login Credentials

### Admin Login
- **Email:** aditya9009@gmail.com
- **Password:** aditya1234

### User Login
- Register a new account via the Sign Up page

---

## ✨ Features

### User Features
- ✅ Sign Up / Login with JWT authentication
- ✅ Browse 15+ cars with search & category filter
- ✅ Book a ride (pickup, drop, date, distance)
- ✅ View booking history with payment status
- ✅ Fake payment with 2s simulation delay

### Admin Features
- ✅ View all cars with delete option
- ✅ Add new cars with image preview
- ✅ View all registered users
- ✅ View all bookings with revenue stats

---

## 🌐 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/signup | Public | Register user |
| POST | /api/auth/login | Public | Login user/admin |
| GET | /api/cars | Public | Get all cars |
| GET | /api/cars/:id | Public | Get single car |
| POST | /api/cars | Admin | Add new car |
| DELETE | /api/cars/:id | Admin | Delete car |
| POST | /api/bookings | User | Create booking |
| GET | /api/bookings/my | User | Get my bookings |
| PATCH | /api/bookings/:id/pay | User | Mark as paid |
| GET | /api/admin/users | Admin | Get all users |
| GET | /api/admin/bookings | Admin | Get all bookings |

---

## 🗄️ Database Schema

### User
```js
{ name, email, password (hashed), role: 'user'|'admin' }
```

### Car
```js
{ name, pricePerKm, availability, image, category }
```

### Booking
```js
{ userId, carId, pickup, drop, date, distance, amount, paymentStatus }
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| HTTP | Axios |
| Fonts | Syne + DM Sans (Google Fonts) |
