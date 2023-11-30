const express = require('express');
const router = require('express').Router();
const authMiddleware = require('./../middlewares/auth');
const fileMiddleware = require('./../middlewares/file');

const usersController = require('./../controllers/users');
const activitiesController = require('./../controllers/activities');
const relationshipController = require('./../controllers/relationships');
const notesController = require('./../controllers/notes');
const loginController = require('./../controllers/login');

router.use(express.json());

//Auth
router.post('/login', loginController.login);

// Users
router.get('/users', authMiddleware,usersController.list);
router.post('/users', usersController.create);
router.put('/users/:id', authMiddleware, usersController.edit);
router.delete('/users/:id', authMiddleware, usersController.delete);
router.get('/users/:id', authMiddleware, usersController.show);
router.post('/users/:id/upload', authMiddleware, fileMiddleware.single('file'), usersController.upload);
router.get('/users/:id/uploads', authMiddleware, usersController.attachments);

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

//Relationships
router.get('/relationships', relationshipController.list);
router.post('/relationships', relationshipController.create);
router.put('/relationships/:id', authMiddleware, relationshipController.edit);
router.delete('/relationship/:id', authMiddleware, relationshipController.delete);
router.get('/relationship/:id', authMiddleware, relationshipController.show);

//Notes
router.get('/notes', notesController.list);
router.post('/notes', notesController.create);
router.get('/notes/:id', authMiddleware,notesController.show);
router.put('/notes/:id', authMiddleware,notesController.edit);
router.delete('/notes/:id', authMiddleware,notesController.delete);

module.exports = router;
