const express = require('express');
const router = express.Router();
const courseScheduleController = require('../controllers/courseSchedule')

router.get('/possible_courses', courseScheduleController.getPossibleCourses);

router.get('/all', courseScheduleController.getCoursesSchedules);


module.exports = router;