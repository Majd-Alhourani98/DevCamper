const express = require('express');

dotenv = require('dotenv');

// Load Environment variables
dotenv.config({ path: './config/config.env' });

// Create express application
const app = express();

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
