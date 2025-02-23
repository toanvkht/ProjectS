var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');

// Import các route
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRoutes = require('./routes/auth');
var tutorRoutes = require('./routes/Tutor');
var messageRoutes = require('./routes/message');
var appointmentRoutes = require('./routes/appointment');
var documentRoutes = require('./routes/document');
var blogRoutes = require('./routes/blog');
var dashboardRoutes = require('./routes/dashboard');
var userpageRoutes = require('./routes/userpage'); // Thêm dòng này

var app = express();

// Thiết lập view engine (HBS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Các middleware cơ bản
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware kiểm tra xác thực
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

// Cấu hình session (nên đặt trước khi khởi tạo Passport)
app.use(session({
  secret: 'yourSecret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

// Cấu hình Passport
var passport = require('passport');
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

// Kết nối MongoDB (không thay đổi đoạn code này)
var mongoose = require('mongoose');
var uri = "mongodb+srv://TestProject123456:123@cluster0.zbmtc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.set('strictQuery', true);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('MongoDB connection error:', err));

// Định nghĩa các route
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRoutes);
app.use('/tutor', tutorRoutes);
app.use('/message', messageRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/document', documentRoutes); 
app.use('/blog', blogRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/userpage', userpageRoutes); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Chỉ hiển thị chi tiết lỗi ở chế độ phát triển
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render trang error với status code tương ứng
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;