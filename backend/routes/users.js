const router = require('express').Router();
const userController = require('../controllers/user');

router.post('/users', userController.create)
router.get('/users', userController.view);


module.exports = router;