const express = require('express');
const localpartnershipController = require('../controllers/localpartnershipController');
const { authenticateOnwer } = require('../middlewares/authenticateOwner');
const authController = require('../controllers/authController');
const UserRepository = require('../data/database/UserRepository');

const router = express.Router();

// Routes for user registration and authentication
router.post('/addworkshop', authenticateOnwer, localpartnershipController.addWorkshop); 



















module.exports = router;
