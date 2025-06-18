const express = require('express');
const router = express.Router();
const {
  createChannel,
  getUserChannels,
  hideChannelForUser,
  unhideChannelForUser,
  getAllChannels // ✅ thêm dòng này
} = require('../controllers/chatChannelController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAllChannels); // ✅ Admin: xem toàn bộ

// POST: Tạo kênh giữa 2 người
router.post('/', protect, createChannel);

// GET: Lấy tất cả kênh của 1 user
router.get('/:userId', protect, getUserChannels);


router.patch('/:id/hide', protect, hideChannelForUser);      // ✅ Ẩn kênh
router.patch('/:id/unhide', protect, unhideChannelForUser);  // ✅ Hiện kênh

module.exports = router;
