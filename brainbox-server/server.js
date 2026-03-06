const express = require('express');
const mongoose = require('mongoose');
const config = require('./src/config/environment');

const app = express();

// Connect to MongoDB using environment variable
mongoose.connect(config.mongodbUri)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Your routes here...

app.listen(config.port, () => {
  console.log(🚀 Server running on port );
});
