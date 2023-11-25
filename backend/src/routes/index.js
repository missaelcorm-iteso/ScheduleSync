const express = require('express');
const router = require('express').Router();
const authMiddleware = require('./../middlewares/auth');
const usersController = require('./../controllers/users');
const activitiesController = require('./../controllers/activities');
const loginController = require('./../controllers/login');
const scheduleController = require('./../controllers/schedule');
const pdfParser = require('./../utils/pdf-parser');

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
router.get('/schedule', scheduleController.list);
router.post('/schedule', scheduleController.create);
router.get('/users/:scheduleId', authMiddleware, scheduleController.show);

//Shared activities




module.exports = router;
