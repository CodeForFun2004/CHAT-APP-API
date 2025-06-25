const  hostname  = require('os');

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const passport = require('passport');



const connectDB = require('./config/database'); // 🔧 Đường dẫn DB

const userRoutes = require('./routes/userRoutes')
const channelRoutes = require('./routes/channelRoutes')

const messageRoutes = require('./routes/messageRoutes'); // 🔧 API route

const ChatMessage = require('./models/Chatmessage'); // ✅ Model để thao tác seen
const friendRoutes = require('./routes/friendRoutes'); // route friends


dotenv.config();
connectDB();
require('./config/passport');  // import sau dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());



const authRoutes = require('./routes/authRoutes');   // authRoutes phải gọi sau .env
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes); // 🔗 Gắn API
app.use('/api/friends', friendRoutes);

// ✅ Cách đúng: Test API trả về chuỗi "Hello World"
app.get('/', (req, res) => {
  res.send('✅ Hello World from Render!');
});

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Test refresh token
const protectedRoutes = require('./routes/protected');
const { log } = require('console');
app.use('/api', protectedRoutes); // Gắn /api/protected-test

const BASE_URL = "https://chat-app-ui-qbo6.onrender.com";

const server = http.createServer(app);
 const io = new Server(server, {
  cors: {
    origin:BASE_URL,
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('🔌 New client connected');

  socket.on('joinChannel', (channelId) => {
    socket.join(channelId);
    console.log(`📥 Joined channel ${channelId}`);
  });

  socket.on('sendMessage', async (messageData) => {
    const { channelId, senderId, content } = messageData;
    try {
      const newMsg = await ChatMessage.create({
        channel: channelId,
        sender: senderId,
        content
      });

      io.to(channelId).emit('newMessage', newMsg);
    } catch (err) {
      console.error('❌ Error saving message:', err.message);
    }
  });


  // ✅ Real-time Seen
  socket.on('seenMessages', async ({ channelId, userId }) => {
    try {
      await ChatMessage.updateMany(
        { channel: channelId, seenBy: { $ne: userId } },
        { $addToSet: { seenBy: userId } }
      );
      socket.to(channelId).emit('messagesSeen', { channelId, seenBy: userId });
      console.log(`👁️ User ${userId} has seen messages in channel ${channelId}`);
    } catch (err) {
      console.error('❌ Error in seenMessages:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () =>{
   console.log(`🚀 HHHHHHH Server running on http://localhost:${PORT}`)
});

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
module.exports = { BASE_URL }