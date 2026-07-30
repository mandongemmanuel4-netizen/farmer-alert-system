require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { startJobs } = require('./jobs/checkInJobs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // needed for Africa's Talking USSD form-encoded POSTs

connectDB();
startJobs();

app.get('/', (req, res) => {
  res.json({ message: 'Farmer Security & Distress Alert System API is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/farms', require('./routes/farmRoutes'));
app.use('/api/contacts', require('./routes/emergencyContactRoutes'));
app.use('/api/checkins', require('./routes/checkInRoutes'));
app.use('/api/coordinator', require('./routes/coordinatorRoutes'));
app.use('/api/ussd', require('./routes/ussdRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
