const router = require('express').Router();
const activityController = require('../controllers/activity');

router.post('/activities', activityController.create)
router.get('/activities', activityController.view);


module.exports = router;