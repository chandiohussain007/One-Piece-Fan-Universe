const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminExists = await User.findOne({ email: 'admin@one.piece.com' });
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        email: 'admin@one.piece.com',
        password: 'Zoro@Uchiha3',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created!');
      console.log('Email: admin@one.piece.com');
      console.log('Password: Zoro@Uchiha3');
    } else {
      console.log('Admin user already exists');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();