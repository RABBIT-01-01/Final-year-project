const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const reportRoutes = require('./routes/report.routes');
const connectDB = require('./db/db');
// Connect to the database
connectDB.connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());





app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use('/api/users', userRoutes);
app.use('/api/requests', reportRoutes);

module.exports = app;