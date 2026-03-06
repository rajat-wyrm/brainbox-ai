const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const User = require('../src/models/User');

const users = [
  {
    email: 'admin@brainbox.ai',
    password: 'Admin@123',
    username: 'admin',
    'profile.displayName': 'Admin User',
    role: 'admin',
    isEmailVerified: true
  },
  {
    email: 'test@example.com',
    password: 'Test@123',
    username: 'testuser',
    'profile.displayName': 'Test User',
    role: 'user',
    isEmailVerified: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    console.log('✅ Cleared existing users');

    // Create users
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${userData.email}`);
    }

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
