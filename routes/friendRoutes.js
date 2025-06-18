// 📁 routes/friendRoutes.js
const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendRequestController');

router.post('/request', friendController.sendRequest);
router.get('/requests/:userId', friendController.getRequestsByUser);
router.patch('/accept/:id', friendController.acceptRequest);
router.patch('/reject/:id', friendController.rejectRequest);

module.exports = router;