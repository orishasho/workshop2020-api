const express = require('express');
const router = express.Router();
const userScheduleDraftController = require('../controllers/userScheduleDraft')

router.get('/allNames', userScheduleDraftController.getUserScheduleDraftNames);
router.get('/byName', userScheduleDraftController.getUserScheduleDraftByName);
router.post('/all', userScheduleDraftController.postUserScheduleDraft);

module.exports = router;