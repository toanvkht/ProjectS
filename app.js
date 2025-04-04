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
const hbs = require('hbs'); 
const dotenv = require('dotenv');

require('./config/database'); 
<<<<<<< HEAD
require('./config/passport')(passport);
require('./config/upload');
require('./middleware/auth');
=======
require('./config/passport')(passport); 
>>>>>>> 9e5be9f09055bf76bc938df4b1b28c33b5d7f736

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
  cors: { origin: "*" }
});

<<<<<<< HEAD
// 🟢 Danh sách người dùng online
const onlineUsers = {};

// 📡 Xử lý kết nối socket.io
io.on('connection', (socket) => {
    console.log("⚡ Client kết nối:", socket.id);
=======
// Import các route
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRoutes = require('./routes/auth');
var tutorRoutes = require('./routes/Tutor');
var messageRoutes = require('./routes/message');
var documentRoutes = require('./routes/document');
var blogRoutes = require('./routes/blog');
var dashboardRoutes = require('./routes/admin_dashboard');
var userpageRoutes = require('./routes/userpage');
>>>>>>> 9e5be9f09055bf76bc938df4b1b28c33b5d7f736

    // ✅ Đăng ký user vào phòng theo userId
    socket.on('registerUser', (userId) => {
        socket.join(userId);
        onlineUsers[userId] = socket.id;
        console.log(`✅ User ${userId} joined room`);
    });

    // ✅ Xử lý gửi tin nhắn
    socket.on('sendMessage', (data) => {
        console.log("📩 Nhận tin nhắn từ client:", data);

        // 📡 Gửi tin nhắn đến người nhận
        io.to(data.receiver).emit('receiveMessage', data);

        // 📡 Gửi tin nhắn đến chính người gửi để cập nhật UI
        io.to(data.sender).emit('messageSent', data);
    });

    // ❌ Xóa user khi ngắt kết nối
    socket.on('disconnect', () => {
        for (const userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
                console.log(`❌ User ${userId} disconnected`);
                break;
            }
        }
    });
});

// 🔧 Middleware cơ bản
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(flash());

// ✅ Đăng ký helper "eq" sau khi import hbs
hbs.registerHelper("isSender", function (sender, userId) {
  return sender.toString() === userId.toString();
});
hbs.registerHelper('formatDate', function(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN', {
      hour: '2-digit', 
      minute: '2-digit', 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
  });
});

<<<<<<< HEAD
// 🛡 Cấu hình session & Passport
=======

// Cấu hình session & Passport
>>>>>>> 9e5be9f09055bf76bc938df4b1b28c33b5d7f736
app.use(session({
  secret: 'yourSecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Xác thực user cho mọi request
const { ensureAuthenticated } = require('./middleware/auth');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// 🔗 Import Routes
const routes = {
  index: require('./routes/index'),
  users: require('./routes/users'),
  auth: require('./routes/auth'),
<<<<<<< HEAD
  message: require('./routes/message')(io), 
=======
  tutor: require('./routes/Tutor'),
  message: require('./routes/message'),
>>>>>>> 9e5be9f09055bf76bc938df4b1b28c33b5d7f736
  meeting: require('./routes/meeting'),
  document: require('./routes/document'),
  blog: require('./routes/blog'),
  admin_dashboard: require('./routes/admin_dashboard'),
  userpage: require('./routes/userpage'),
  class: require('./routes/class'),
<<<<<<< HEAD
  schedule: require('./routes/schedule'),
  tutor: require('./routes/tutor') 
=======
  schedule: require('./routes/schedule')
>>>>>>> 9e5be9f09055bf76bc938df4b1b28c33b5d7f736
};


// 🛣 Định nghĩa Routes
app.use('/', routes.index);
app.use('/users', routes.users);
app.use('/auth', routes.auth);
app.use('/tutor', routes.tutor);
app.use('/message', routes.message);
app.use('/meeting', routes.meeting);
app.use('/document', routes.document);
app.use('/blog', routes.blog);
app.use('/admin/dashboard', routes.admin_dashboard);
app.use('/userpage', routes.userpage);
app.use('/class', routes.class);
<<<<<<< HEAD
app.use('/schedule', routes.schedule);

// ❌ Xử lý lỗi 404
=======
app.use('/schedule', routes.schedule)
const onlineUsers = {};

// Socket.io connection
io.on('connection', (socket) => {
  console.log('🔗 Một người dùng đã kết nối');

  socket.on('registerUser', (userId) => {
      socket.userId = userId;
      console.log(`✅ Người dùng ${userId} đã đăng ký socket.`);
      socket.join(userId);
  });

  socket.on('chat message', async (msg) => {
      console.log("📩 Nhận tin nhắn từ client:", msg);

      if (!msg.sender || !msg.receiver || !msg.message) {
          console.error("⚠️ Tin nhắn không hợp lệ!", msg);
          return;
      }

      try {
          // Lưu tin nhắn vào database
          const newMessage = new Message({
              sender: msg.sender,
              receiver: msg.receiver,
              message: msg.message
          });

          await newMessage.save();
          console.log("✅ Tin nhắn đã lưu vào database:", newMessage);

          // Lấy thông tin người gửi và người nhận từ DB
          const senderInfo = await User.findById(msg.sender);
          const receiverInfo = await User.findById(msg.receiver);

          if (!senderInfo || !receiverInfo) return console.error("⚠️ Không tìm thấy người gửi hoặc người nhận!");

          // Gửi tin nhắn đến đúng hai người
          // Gửi tin nhắn ngay lập tức cho cả người gửi và người nhận
        io.to(msg.sender).emit("chat message", {
          sender: msg.sender,
          receiver: msg.receiver,
          senderName: "Bạn",
          message: msg.message,
          });

          io.to(msg.receiver).emit("chat message", {
              sender: msg.sender,
              receiver: msg.receiver,
              senderName: msg.senderName, // Lấy tên từ client để hiển thị chính xác
              message: msg.message,
          });

          console.log("📩 Tin nhắn đã gửi đến:", msg.sender, msg.receiver);
          
      } catch (err) {
          console.error("❌ Lỗi khi lưu tin nhắn vào database:", err);
      }
  });

  socket.on('disconnect', () => {
      console.log(`❌ Người dùng ${socket.userId} đã ngắt kết nối`);
  });
});

// Xử lý lỗi 404
>>>>>>> 9e5be9f09055bf76bc938df4b1b28c33b5d7f736
app.use((req, res, next) => next(createError(404)));

// ❌ Xử lý lỗi chung
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 400);
  res.render('error');
});

<<<<<<< HEAD
// 🚀 **Chạy server**
httpServer.listen(3001, () => {
  console.log('🚀 Server is running on port 3001');
=======
app.listen(3001, () => {
  console.log('Server is running');
>>>>>>> 9e5be9f09055bf76bc938df4b1b28c33b5d7f736
});

module.exports = app;