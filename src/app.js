const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Finance Backend API is running.' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

module.exports = app;
