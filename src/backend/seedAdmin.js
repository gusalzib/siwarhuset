const path = require('path');
const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, envFile) });
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    // If MONGODB_URI is undefined, default to the local db
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/siwar_huset';
    await mongoose.connect(uri);
    
    const email = 'admin@siwarhuset.com';
    const password = 'password123';

    const adminExists = await User.findOne({ email });
    if (adminExists) {
      console.log('Admin already exists. Credentials:');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      process.exit(0);
    }

    await User.create({
      name: 'Siwar Huset Admin',
      email: email,
      password: password,
      role: 'admin'
    });

    console.log('Admin user created successfully! Credentials:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
