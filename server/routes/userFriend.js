const express = require('express');
const router = express.Router();
const userFriendController = require('../controllers/userFriend')

router.get('/friendsByUser', userFriendController.handleGetFriendsByUser);
router.get('/friendRequestsByUser', userFriendController.handleGetFriendRequestsByUser);
router.get('/friendRequestsByUserCount', userFriendController.handleGetFriendRequestsByUserCount);
router.post('/sendFriendRequest', userFriendController.handleSendFriendRequest);
router.put('/setReceivedFriendRequest', userFriendController.handleSetFriendRequest);

module.exports = router;