const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const upload = require('express-fileupload');

// Routes Connection
const authRouter = require('./routes/authRoutes');

const app = express();
app.use(upload());
app.use(express.static('images'));
app.use(express.json());
app.use(cookieParser());

// ejs file set view folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', authRouter);

// Error handling
app.use((err, req, res, next) => {
    let error = { ...err }
    if (error.code === 11000) {
        err.message = "Duplicate field value: email. Please use another value";
        err.statusCode = 401;
    }
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'errors';
  return  res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
});


// Start Server
module.exports = app;