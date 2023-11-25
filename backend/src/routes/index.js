const express = require('express');
const router = require('express').Router();
const multer = require('multer');
const authMiddleware = require('./../middlewares/auth');
const usersController = require('./../controllers/users');
const activitiesController = require('./../controllers/activities');
const loginController = require('./../controllers/login');
const scheduleController = require('./../controllers/schedule');
const pdfParser = require('./../utils/pdf-parser');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage});

router.use(express.json());

//Auth
router.post('/login', loginController.login);

// Users
router.get('/users', authMiddleware, usersController.list);
router.post('/users', usersController.create);
router.put('/users/:id', authMiddleware, usersController.edit);
router.delete('/users/:id', authMiddleware, usersController.delete);
router.get('/users/:id', authMiddleware, usersController.show);

// Activities
router.use('/activities', authMiddleware);
router.get('/activities', activitiesController.list);
router.get('/activities/today', activitiesController.today);
router.post('/activities', activitiesController.create);
router.put('/activities/:activityId', activitiesController.edit);
router.delete('/activities/:activityId', activitiesController.delete);
router.get('/activities/:activityId', activitiesController.show);
router.post('/activities/:activityId/complete', activitiesController.complete);
router.post('/activities/:activityId/uncomplete', activitiesController.uncomplete);

//Schedule
router.use('/schedule', authMiddleware);
router.post('/schedule/user/upload', upload.single('pdfFile'), async (req, res) => {
    try {
        const filename = req.file.filename;
        const path = req.file.path;
        const scheduleData = await pdfParser(path);
        await scheduleController.create(scheduleData, req.userId);
        res.json({ success: true, filename, path});
    } catch (error) {
        console.log('There was an error uploading the file...', error);
        res.status(500).json({ success: false, error: 'There was an error uploading the file...'});
    }
});
router.get('/schedule', scheduleController.list);
router.get('/users/:scheduleId', authMiddleware, scheduleController.show);

//Shared activities


module.exports = router;
