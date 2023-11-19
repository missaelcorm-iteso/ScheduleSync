const express = require('express');
const router = require('express').Router();

const authMiddleware = require('./../middlewares/auth');

const usersController = require('./../controllers/users');
const activitiesController = require('./../controllers/activities');
const loginController = require('./../controllers/login');

router.use(express.json());

//Auth
router.post('/login', loginController.login);

// Users
router.get('/users', authMiddleware);
router.get('/users', usersController.list);
router.post('/users', usersController.create);
router.put('/users/:id', authMiddleware, usersController.edit);
router.delete('/users/:id', authMiddleware, usersController.delete);
router.get('/users/:id', usersController.show);

// Activities
router.use('/users/:userId/activities', authMiddleware);
router.get('/users/:userId/activities/', activitiesController.list);
router.post('/users/:userId/activities', activitiesController.create);
router.put('/users/:userId/activities/:activityId', activitiesController.edit);
router.delete('/users/:userId/activities/:activityId', activitiesController.delete);
router.get('/users/:userId/activities/:activityId', activitiesController.show);

module.exports = router;
