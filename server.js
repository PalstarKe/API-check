const express = require("express");
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

require("dotenv").config();
const path = require('path');
const ApiError = require('./utils/apiError');
const globalError = require('./middleware/errorMiddleware');
const mountRoutes = require('./routes');

require("./db/connection");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3003;

const publicDirectory = path.join(__dirname, 'public')
app.use(express.static(publicDirectory))

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

app.listen(PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
// Global error handling middleware for express
app.use(globalError);


// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      'price',
      'sold',
      'pages',
      'ratingsAverage',
      'ratingsQuantity',
    ],
  })
);

// Mount Routes
mountRoutes(app);

app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

// Apply the rate limiting middleware to all requests
app.use('/', limiter);