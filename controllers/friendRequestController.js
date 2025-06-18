const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');
const ChatChannel = require('../models/Chatchannel');

// Gửi lời mời
exports.sendRequest = async (req, res) => {
  const { from, to } = req.body;
  try {
    const exists = await FriendRequest.findOne({ from, to, status: 'pending' });
    if (exists) return res.status(400).json({ error: 'Request already sent.' });

    const newReq = await FriendRequest.create({ from, to });
    res.status(201).json(newReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách lời mời
exports.getRequestsByUser = async (req, res) => {
  try {
    const requests = await FriendRequest.find({ to: req.params.userId, status: 'pending' })
      .populate('from', 'username email avatar');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Chấp nhận
exports.acceptRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.id);
    if (!request || request.status !== 'pending') return res.status(404).json({ error: 'Request not found' });

    request.status = 'accepted';
    await request.save();

    await User.findByIdAndUpdate(request.from, { $addToSet: { friends: request.to } });
    await User.findByIdAndUpdate(request.to, { $addToSet: { friends: request.from } });

    const existingChannel = await ChatChannel.findOne({ members: { $all: [request.from, request.to] } });
    if (!existingChannel) {
      await ChatChannel.create({ members: [request.from, request.to] });
    }

    res.json({ message: 'Friend request accepted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Từ chối
exports.rejectRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.id);
    if (!request || request.status !== 'pending') return res.status(404).json({ error: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Friend request rejected.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};