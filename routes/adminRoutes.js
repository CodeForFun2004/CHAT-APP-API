const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/stats', protect, isAdmin, adminController.getStats);
router.get('/users', protect, isAdmin, adminController.filterUsers);
router.patch('/users/:id/ban', protect, isAdmin, adminController.banUser);


module.exports = router;
