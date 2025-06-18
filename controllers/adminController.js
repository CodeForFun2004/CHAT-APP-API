const User = require('../models/User');
const Channel = require('../models/Chatchannel');
const ChatMessage = require('../models/Chatmessage');

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChannels = await Channel.countDocuments();
    const totalMessages = await ChatMessage.countDocuments();

    res.json({
      totalUsers,
      totalChannels,
      totalMessages
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Câu lệnh kết hợp hay
// GET /api/admin/users?isBanned=true&role=admin&search=abc
exports.filterUsers = async (req, res) => {
    try {
      const { isBanned, role, search } = req.query;
  
      const filter = {};
  
      if (isBanned !== undefined) {
        filter.isBanned = isBanned === 'true';
      }
  
      if (role) {
        filter.role = role;
      }
  
      if (search) {
        filter.$or = [
          { username: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ];
      }
  
      const users = await User.find(filter).select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // Ban/Unban user
  exports.banUser = async (req, res) => {
    const { id } = req.params;
    const { isBanned } = req.body;
  
    if (typeof isBanned !== 'boolean') {
      return res.status(400).json({ message: 'Giá trị isBanned phải là true hoặc false' });
    }
  
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { isBanned },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
  
      res.json({
        message: isBanned ? 'Người dùng đã bị khóa' : 'Người dùng đã được mở khóa',
        user
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  