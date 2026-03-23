require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.get('/api', (req, res) => res.send('Siwar Huset API is running'));
app.use('/api/auth', require('./routes/authRoutes'));
const path = require('path');

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
