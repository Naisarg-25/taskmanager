const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./Route');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(taskRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
 