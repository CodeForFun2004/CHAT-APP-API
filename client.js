const { io } = require('socket.io-client');

// 🟢 Dữ liệu test
const channelId = '684da2f9c90a746385c6cca0';
const senderId = '684d4146ffa547c6b6dc02cc';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✅ Connected to server');

  // Tham gia channel
  socket.emit('joinChannel', channelId);
  console.log(`📥 Joined channel ${channelId}`);

  // ⏱️ Gửi tin nhắn sau 1s
  setTimeout(() => {
    socket.emit('sendMessage', {
      channelId,
      senderId,
      content: "📝 Hello from client.js test!"
    });
    console.log(`📤 Sent message to channel ${channelId}`);
  }, 1000);

  // ⏱️ Sau 3s thì gửi sự kiện đã xem
  setTimeout(() => {
    socket.emit('seenMessages', { channelId, userId: senderId });
    console.log(`👁️ Sent seenMessages for channel ${channelId}`);
  }, 3000);
});

// Nhận thông báo khi có người đã xem
socket.on('messagesSeen', ({ channelId, seenBy }) => {
  console.log(`✅ User ${seenBy} Quốc Huy has seen messages in channel ${channelId} của Sương`);
});

// Nhận tin nhắn mới từ server
socket.on('newMessage', (msg) => {
  console.log(`💬 New message from Quệ Shương ${msg.sender}: ${msg.content}`);
});
