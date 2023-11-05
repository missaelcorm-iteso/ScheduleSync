const express = require('express');
const router = require('express').Router();

const usersController = require('./../controllers/users');
const activitiesController = require('./../controllers/activities');

router.use(express.json());


// Users
router.get('/users', usersController.list);
router.post('/users', usersController.create);
router.put('/users/:id', usersController.edit);
router.delete('/users/:id', usersController.delete);
router.get('/users/:id', usersController.show);

// Activities
router.get('/activities', activitiesController.list);
router.post('/activities', activitiesController.create);
router.put('/activities/:id', activitiesController.edit);
router.delete('/activities/:id', activitiesController.delete);
router.get('/activities/:id', activitiesController.show);

module.exports = router;
