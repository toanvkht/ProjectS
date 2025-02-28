const createError = require('http-errors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');

// Cấu hình MongoDB
require('./config/database'); // Kết nối MongoDB
require('./config/passport')(passport); // Cấu hình Passport

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware cơ bản
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(flash());

// Cấu hình session & Passport
app.use(session({
  secret: 'yourSecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// Middleware xác thực
const { ensureAuthenticated } = require('./middleware/auth');

// Import Routes
const routes = {
  index: require('./routes/index'),
  users: require('./routes/users'),
  auth: require('./routes/auth'),
  tutor: require('./routes/Tutor'),
  message: require('./routes/message'),
  appointment: require('./routes/appointment'),
  document: require('./routes/document'),
  blog: require('./routes/blog'),
  dashboard: require('./routes/dashboard'),
  userpage: require('./routes/userpage')
};

// Định nghĩa Routes
app.use('/', routes.index);
app.use('/users', routes.users);
app.use('/auth', routes.auth);
app.use('/tutor', routes.tutor);
app.use('/message', routes.message);
app.use('/appointment', routes.appointment);
app.use('/document', routes.document);
app.use('/blog', routes.blog);
app.use('/dashboard', routes.dashboard);
app.use('/userpage', routes.userpage);

// Xử lý Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', async (data) => {
      const { senderId, receiverId, message } = data;

      // Lưu tin nhắn vào database
      const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          text: message
      });
      await newMessage.save();

      // Gửi tin nhắn đến cả hai người dùng
      io.emit('chat message', {
          senderName: (await User.findById(senderId)).fullname,
          message
      });
  });

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});

// Xử lý lỗi 404
app.use((req, res, next) => next(createError(404)));

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
