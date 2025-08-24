const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const reportRoutes = require('./routes/report.routes');
const connectDB = require('./db/db');
// Connect to the database
connectDB.connectDB();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN, // ✅ Allow only your frontend
  credentials: true,       // ✅ Allow cookies
}));

app.use("/api/uploads", cors(), express.static("uploads"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);


app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use('/api/users', userRoutes);
app.use('/api/requests', reportRoutes);
// Serve uploaded files
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;