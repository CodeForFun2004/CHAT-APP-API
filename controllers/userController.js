const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('friends', 'username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Tạo người dùng mới (admin sử dụng)
exports.createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      avatar,
      password,
      googleId,
      friends = [],
      role = 'user',
      isActive = true,
      isBanned = false
    } = req.body;

    const user = new User({
      username,
      email,
      avatar,
      googleId,
      role,
      isActive,
      isBanned,
      friends: friends.map(id => new mongoose.Types.ObjectId(id))
    });

    // ✅ Nếu có password → hash trước khi save (userSchema sẽ xử lý trong pre('save'))
    if (password) {
      user.password = password;
    }

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    // ✅ Nếu cập nhật friends → chuyển về ObjectId[]
    if (updates.friends) {
      updates.friends = updates.friends.map(id => new mongoose.Types.ObjectId(id));
    }

    // ✅ Nếu có password mới → mã hoá trước khi update
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// [GET] /api/users/:id - Lấy thông tin người dùng theo ID
exports.getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate('friends', 'username email');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };


  // getUser profile   dùng để xem profile nguòi khác
  exports.getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate('friends', 'username avatar email')
        .select('-__v');
  
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const response = {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        friends: user.friends,
        friendCount: user.friends.length
      };
  
      res.json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // get current user   để lấy session của cá nhân đăng nhập
  exports.getCurrentUser = async (req, res) => {
    try {
      const user = req.user;
  
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        friendCount: user.friends?.length || 0,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // [GET] /api/users/:id/friends
exports.getUserFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('friends', 'username avatar email');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// [GET] /api/users/:id/suggestions
exports.getFriendSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    const excludeIds = [
      currentUser._id,
      ...currentUser.friends
    ];

    const suggestions = await User.find({ _id: { $nin: excludeIds } })
      .select('username email avatar');

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

