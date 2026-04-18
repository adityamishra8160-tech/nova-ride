// =============================================
// Nova Ride Easily - Express Server
// =============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Routes ----
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));

// ---- Root Route ----
app.get('/', (req, res) => {
  res.json({ message: 'Nova Ride Easily API is running!' });
});

// ---- Connect to MongoDB & Start Server ----
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    // Seed default cars if none exist
    await seedCars();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ---- Seed Default Cars ----
async function seedCars() {
  const Car = require('./models/Car');
  const count = await Car.countDocuments();
  if (count === 0) {
    const defaultCars = [
      {
        name: 'Toyota Camry',
        pricePerKm: 12,
        availability: true,
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80',
        category: 'Sedan',
      },
      {
        name: 'Honda City',
        pricePerKm: 10,
        availability: true,
        image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&q=80',
        category: 'Sedan',
      },
      {
        name: 'BMW 3 Series',
        pricePerKm: 22,
        availability: true,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
        category: 'Luxury',
      },
      {
        name: 'Mercedes C-Class',
        pricePerKm: 25,
        availability: true,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80',
        category: 'Luxury',
      },
      {
        name: 'Hyundai Creta',
        pricePerKm: 13,
        availability: true,
        image: 'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=600&q=80',
        category: 'SUV',
      },
      {
        name: 'Mahindra XUV700',
        pricePerKm: 15,
        availability: true,
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80',
        category: 'SUV',
      },
      {
        name: 'Tesla Model 3',
        pricePerKm: 20,
        availability: true,
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80',
        category: 'Electric',
      },
      {
        name: 'Kia Seltos',
        pricePerKm: 14,
        availability: true,
        image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80',
        category: 'SUV',
      },
      {
        name: 'Tata Nexon EV',
        pricePerKm: 11,
        availability: true,
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80',
        category: 'Electric',
      },
      {
        name: 'Audi A4',
        pricePerKm: 28,
        availability: true,
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80',
        category: 'Luxury',
      },
      {
        name: 'Ford Mustang',
        pricePerKm: 30,
        availability: true,
        image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=600&q=80',
        category: 'Sports',
      },
      {
        name: 'Maruti Swift',
        pricePerKm: 8,
        availability: true,
        image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&q=80',
        category: 'Hatchback',
      },
      {
        name: 'Volkswagen Polo',
        pricePerKm: 9,
        availability: true,
        image: 'https://images.unsplash.com/photo-1471479917193-f00955256257?w=600&q=80',
        category: 'Hatchback',
      },
      {
        name: 'Toyota Fortuner',
        pricePerKm: 18,
        availability: true,
        image: 'https://images.unsplash.com/photo-1570733577524-3a047079e80d?w=600&q=80',
        category: 'SUV',
      },
      {
        name: 'Jeep Compass',
        pricePerKm: 16,
        availability: true,
        image: 'https://images.unsplash.com/photo-1625231338203-9f7b6f4f6b2b?w=600&q=80',
        category: 'SUV',
      },
    ];
    await Car.insertMany(defaultCars);
    console.log('🚗 15 default cars seeded!');
  }
}
