const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course')

router.get('/mandatory', courseController.getMandatoryCourses);

router.get('/elective', courseController.getElectiveCourses);

router.get('/math', courseController.getMathCourses);

router.get('/workshop', courseController.getWorkshopCourses);

module.exports = router;