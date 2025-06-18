const ChatMessage = require('../models/Chatmessage');
const Channel = require('../models/Chatchannel');

// Gửi tin nhắn vào channel (có kiểm tra bảo mật)
exports.sendMessage = async (req, res) => {
  const { channelId, senderId, content } = req.body;

  try {

     // 🔒 Check bị ban
   if (req.user.isBanned) {
    return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa, không thể gửi tin nhắn.' });
  }
    // Kiểm tra channel tồn tại và người gửi là thành viên
    const channel = await Channel.findById(channelId);
    if (!channel || !channel.members.includes(req.user._id.toString())) {
      return res.status(403).json({ message: 'Bạn không có quyền gửi tin nhắn trong kênh này' });
    }

    const message = new ChatMessage({
      channel: channelId,
      sender: senderId,
      content
    });

    console.log(`${channelId}`);
    console.log(`${senderId}`);
    console.log(`${content}`);

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả tin nhắn của channel (có kiểm tra bảo mật)
exports.getMessagesByChannel = async (req, res) => {
  const { channelId } = req.params;

  try {
    const channel = await Channel.findById(channelId);
    if (!channel || !channel.members.includes(req.user._id.toString())) {
      return res.status(403).json({ message: 'Bạn không có quyền xem tin nhắn trong kênh này' });
    }

    const messages = await ChatMessage.find({ channel: channelId })
      .populate('sender', 'username avatar')
      .populate('seenBy', 'username avatar')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

  



// PATCH /api/messages/:channelId/mark-seen/:userId
exports.markMessagesAsSeen = async (req, res) => {
    const { channelId, userId } = req.params;
  
    try {
      const result = await ChatMessage.updateMany(
        {
          channel: channelId,
          seenBy: { $ne: userId } // chỉ update những tin nhắn chưa được người này xem
        },
        {
          $addToSet: { seenBy: userId } // thêm userId vào mảng seenBy nếu chưa có
        }
      );
  
      res.status(200).json({
        message: `Marked ${result.modifiedCount} messages as seen by user ${userId}`
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  