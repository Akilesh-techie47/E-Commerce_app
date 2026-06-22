// server.js - Main entry point for the backend API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());          // Allow requests from the React frontend
app.use(express.json());  // Parse incoming JSON request bodies

// Connect to MongoDB
connectDB();

// Test route - confirms the server is running
app.get('/', (req, res) => {
  res.send('E-Commerce API is running...');
});

// API routes (we'll add these in upcoming steps)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
