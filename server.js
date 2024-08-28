const express = require('express');

dotenv = require('dotenv');

// Load Environment variables
dotenv.config({ path: './config/config.env' });

// Create express application
const app = express();

app.get('/api/v1/bootcamps', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'get all bootcamps',
  });
});

app.get('/api/v1/bootcamps/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'get single bootcamp',
  });
});

app.post('/api/v1/bootcamps', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create Bootcamp',
  });
});

app.put('/api/v1/bootcamps/:id', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Update Bootcamp',
  });
});

app.delete('/api/v1/bootcamps/:id', (req, res) => {
  res.status(204).json({
    success: true,
    message: 'delete Bootcamp',
  });
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
