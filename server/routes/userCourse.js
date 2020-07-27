const express = require('express');
const router = express.Router();
const userCourseController = require('../controllers/userCourse')

router.post('/bulk', userCourseController.postBulkUserCourse);

router.get('/', userCourseController.handleGetUserCourses);

router.get('/detailed', userCourseController.handleGetUserCoursesDetailed);

module.exports = router;