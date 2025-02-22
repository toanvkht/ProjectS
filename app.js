var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// Các route đã cài đặt

var authRoutes = require('./routes/auth');
var tutorRoutes = require('./routes/Tutor');
var messageRoutes = require('./routes/message');
var appointmentRoutes = require('./routes/appointment');
var documentRoutes = require('./routes/document');
var blogRoutes = require('./routes/blog');
var dashboardRoutes = require('./routes/dashboard');

var app = express();

//HBS
//var hbs = require('hbs');
//hbs.registerHelper('dateFormat', require('handlebars-dateformat')); 
//var hbs = require('hbs');
//hbs.registerHelper('equal', require('handlebars-helper-equal'))
app.use('/auth', authRoutes);
app.use('/tutor', tutorRoutes);
app.use('/message', messageRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/document', documentRoutes);
app.use('/blog', blogRoutes);
app.use('/dashboard', dashboardRoutes);

var passport = require('passport');
require('./config/passport')(passport);

// Kết nối MongoDB
var mongoose = require('mongoose');
var uri = "mongodb+srv://khoihvtgch210919@pft.edu.vn:12345678@cluster0.zbmtc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.set('strictQuery', true);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('MongoDB connection error:', err));

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

app.use(session({
  secret: 'yourSecret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;