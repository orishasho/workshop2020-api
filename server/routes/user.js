const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')

router.post('/', userController.postUserDetails);

router.get('/', userController.handleGetUserDetails);

router.put('/updateUserNameByEmail', userController.updateUserNameByEmail)

module.exports = router;