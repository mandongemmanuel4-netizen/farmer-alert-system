require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Ward = require('../models/Ward');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding test users...');

  const ward = await Ward.findOne({ name: 'Jenta Adamu' });
  if (!ward) {
    console.error('❌ Ward "Jenta Adamu" not found — run seed/seedLocations.js first.');
    process.exit(1);
  }

  const hashedPin = await bcrypt.hash('1234', 10);

  const coordinatorPhone = '08011111111';
  let coordinator = await User.findOne({ phone: coordinatorPhone });
  if (!coordinator) {
    coordinator = await User.create({
      fullName: 'Ahmed Bello (Test CSO)',
      phone: coordinatorPhone,
      pin: hashedPin,
      role: 'coordinator',
      ward: ward._id,
      isActive: true,
    });
    console.log(`✅ Coordinator created — phone: ${coordinatorPhone}, PIN: 1234, ward: ${ward.name}`);
  } else {
    console.log('ℹ️  Coordinator already exists');
  }

  const adminPhone = '08022222222';
  let admin = await User.findOne({ phone: adminPhone });
  if (!admin) {
    admin = await User.create({
      fullName: 'System Administrator',
      phone: adminPhone,
      pin: hashedPin,
      role: 'admin',
      isActive: true,
    });
    console.log(`✅ Admin created — phone: ${adminPhone}, PIN: 1234`);
  } else {
    console.log('ℹ️  Admin already exists');
  }

  console.log('✅ Done. Log in at /login with either phone number above and PIN 1234.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
