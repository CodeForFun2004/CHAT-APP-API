const ChatChannel = require('../models/Chatchannel');
const mongoose = require('mongoose');

// Tạo channel giữa 2 người (không trùng lặp)
exports.createChannel = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    if (!userId1 || !userId2 || userId1 === userId2) {
      return res.status(400).json({ error: 'Invalid user IDs' });
    }

    // Kiểm tra xem đã tồn tại chưa
    const existing = await ChatChannel.findOne({
      members: { $all: [userId1, userId2], $size: 2 }
    });

    if (existing) {
      return res.status(200).json(existing); // ✅ Trả về object channel thay vì message
    }
    

    const newChannel = new ChatChannel({
      members: [userId1, userId2]
    });

    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả channel mà 1 user đang tham gia
exports.getUserChannels = async (req, res) => {
  try {
    const userId = req.params.userId;

    const channels = await ChatChannel.find({
      members: userId
    }).populate('members', 'username avatar');

    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Ẩn channel cho 1 user
exports.hideChannelForUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const updated = await ChatChannel.findByIdAndUpdate(
      id,
      { $addToSet: { isHiddenFor: userId } }, // tránh trùng ID
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Channel not found' });

    res.json({ message: 'Channel hidden', channel: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hiện lại channel
exports.unhideChannelForUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const updated = await ChatChannel.findByIdAndUpdate(
      id,
      { $pull: { isHiddenFor: userId } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Channel not found' });

    res.json({ message: 'Channel unhidden', channel: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// [GET] /api/channels - Dành cho admin: lấy tất cả các kênh chat
exports.getAllChannels = async (req, res) => {
  try {
    const channels = await ChatChannel.find()
      .populate('members', 'username email avatar')
      .populate('isHiddenFor', 'username');

    const formatted = channels.map(channel => ({
      _id: channel._id,
      members: channel.members,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
      hiddenCount: channel.isHiddenFor.length,
      hiddenBy: channel.isHiddenFor.map(u => u.username)
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
