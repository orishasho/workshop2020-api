const express = require('express');
const router = express.Router();
const userRatingController = require('../controllers/userRating')

router.get('/topInteresting', userRatingController.handleGetTopInteresting);
router.get('/topHard', userRatingController.handleGetTopHard);
router.post('/byCourseNumber', userRatingController.postRating);

module.exports = router;