const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  getCurrentUser,
  getUserFriends,
  getFriendSuggestions
} = require('../controllers/userController');

const { protect } = require('../middlewares/authMiddleware');
// GET /api/users/me → Lấy user hiện tại (từ token)
// dòng này phải đặt trước  /:id
router.get('/me', protect, getCurrentUser);

router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById); // 👈 Thêm dòng này
router.post('/', protect, createUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.get('/:id/profile', protect, getUserProfile);
router.get('/:id/friends', getUserFriends);
router.get('/:id/suggestions', getFriendSuggestions);


module.exports = router;
