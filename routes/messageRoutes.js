const express = require('express');
const router = express.Router();
const { sendMessage, getMessagesByChannel, markMessagesAsSeen } = require('../controllers/chatMessageController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/:channelId',  protect, getMessagesByChannel);
router.patch('/:channelId/mark-seen/:userId', protect, markMessagesAsSeen); // ✅ Thêm route seen

module.exports = router;
