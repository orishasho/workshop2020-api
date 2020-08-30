const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')

router.post('/', userController.postUserDetails);

router.get('/', userController.handleGetUserDetails);

router.get('/collegeByUserId', userController.handleGetUserCollegeByUserId);

router.put('/updateUserNameByEmail', userController.updateUserNameByEmail)

router.put('/updateImgByUserId', userController.updateImgByUserId)

module.exports = router;