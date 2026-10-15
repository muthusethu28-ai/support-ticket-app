const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');

async function seedAgent() {
  await connectDB();

  const email = 'agent@example.com';
  const existing = await User.findOne({ email });

  if (existing) {
    console.log('Agent already exists:', email);
  } else {
    await User.create({
      name: 'Support Agent',
      email,
      password: 'Agent@123',
      role: 'agent',
    });
    console.log('Agent created:', email);
  }

  await mongoose.connection.close();
  process.exit(0);
}

seedAgent().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
