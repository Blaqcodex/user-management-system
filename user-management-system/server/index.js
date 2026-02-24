// server/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', require('./routes/users'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log('🟢 Server on :5000')));