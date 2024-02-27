const express = require('express');
const localpartnershipController = require('../controllers/localpartnershipController');
const { authenticateUser } = require('../middlewares/authenticateUser');
const authController = require('../controllers/authController');
const UserRepository = require('../data/database/UserRepository');


const router = express.Router();


// Routes for user registration and authentication
// router.post('/', localpartnershipController.yourFunction); //api/localpartnerships/




















module.exports = router;
