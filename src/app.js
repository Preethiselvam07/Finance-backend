const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(express.json());

// Interactive API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));

app.get('/', (req, res) => {
  res.json({
    message: 'Finance Backend API is running.',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

module.exports = app;
