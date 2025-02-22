var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//HBS
//var hbs = require('hbs');
//hbs.registerHelper('dateFormat', require('handlebars-dateformat')); 
//var hbs = require('hbs');
//hbs.registerHelper('equal', require('handlebars-helper-equal'))



// Kết nối MongoDB
const mongoose = require('mongoose');
var uri = "mongodb+srv://Khoiiiii:12345678@students.9fdhj.mongodb.net/?retryWrites=true&w=majority&appName=Students";
mongoose.set('strictQuery', true);
mongoose.connect(uri)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 3001);
  res.render('error');
});

module.exports = app;
