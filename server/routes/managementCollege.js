const express = require('express');
const router = express.Router();
const managementCollegeController = require('../controllers/managementCollege')

router.get('/user_course/detailed', managementCollegeController.handleGetUserCoursesDetailed);

router.post('user_course/bulk', managementCollegeController.postBulkUserCourse)

router.get('/course/mandatory', managementCollegeController.getMandatoryCourses);

router.get('/course/elective', managementCollegeController.getElectiveCourses);

router.get('/course/workshop', managementCollegeController.getWorkshopCourses);

module.exports = router;