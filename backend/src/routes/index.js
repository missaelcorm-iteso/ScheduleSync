const express = require('express');
const router = require('express').Router();
const authMiddleware = require('./../middlewares/auth');
const fileMiddleware = require('./../middlewares/file');
const usersController = require('./../controllers/users');
const activitiesController = require('./../controllers/activities');
const relationshipController = require('./../controllers/relationships');
const notesController = require('./../controllers/notes');
const loginController = require('./../controllers/login');
const { promController, increment, duration } = require('./../controllers/prom');

router.use(express.json());
// router.use(increment);
// router.use(duration);

//Auth
router.post('/login', loginController.login);

// Users
router.get('/users', authMiddleware, increment, duration, usersController.list);
router.post('/users', increment, duration, usersController.create);
router.put('/users/:id', authMiddleware, increment, duration, usersController.edit);
router.delete('/users/:id', authMiddleware, increment, duration, usersController.delete);
router.get('/users/:id', authMiddleware, increment, duration, usersController.show);
router.post('/users/:id/upload', authMiddleware, increment, duration, fileMiddleware.single('file'), usersController.upload);
router.get('/users/:id/uploads', authMiddleware, increment, duration, usersController.attachments);

// Activities
router.use('/activities', authMiddleware, increment, duration);
router.get('/activities', activitiesController.list);
router.get('/activities/today', activitiesController.today);
router.post('/activities', activitiesController.create);
router.put('/activities/:activityId', activitiesController.edit);
router.delete('/activities/:activityId', activitiesController.delete);
router.get('/activities/:activityId', activitiesController.show);
router.post('/activities/:activityId/complete', activitiesController.complete);
router.post('/activities/:activityId/uncomplete', activitiesController.uncomplete);

//Relationships
router.use('/relationships', authMiddleware, increment, duration);
router.get('/relationships', relationshipController.list);
router.post('/relationships', relationshipController.create);
router.delete('/relationships/:id', relationshipController.delete);


//Notes
router.use('/notes', authMiddleware, increment, duration);
router.get('/notes', notesController.list);
router.post('/notes', notesController.create);
router.delete('/notes/:id', notesController.delete);

//Metrics
router.get('/metrics', increment, duration, promController.metrics);

module.exports = router;
