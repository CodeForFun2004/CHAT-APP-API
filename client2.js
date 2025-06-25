const { io } = require('socket.io-client');
const { BASE_URL } = require('./server.cjs');

// 🟢 Client 2: giả lập người dùng khác đọc tin nhắn
const channelId = '684da2f9c90a746385c6cca0';
const senderId = '684d417cffa547c6b6dc02ce'; // người khác

// const socket = io('http://localhost:3000');

const socket = io(BASE_URL);

socket.on('connect', () => {
  console.log(`✅ Client 2 Quốc Huy connected: ${socket.id}`);

  socket.emit('joinChannel', channelId);

  // Gửi sự kiện seen sau 3 giây
  setTimeout(() => {
    socket.emit('seenMessages', { channelId, userId: senderId });
    console.log(`👁️ Client 2 Quốc Huy đã gửi seenMessages`);
  }, 3000);
});

// Lắng nghe phản hồi từ phía server
socket.on('messagesSeen', ({ channelId, seenBy }) => {
  console.log(`✅ Client 2 thấy rằng user ${seenBy} đã xem kênh ${channelId}`);
});

socket.on('newMessage', (msg) => {
  console.log(`💬 Client 2 nhận được tin nhắn: ${msg.content}`);
});
