const express = require('express');
const skillsController = require('../controllers/skillsController');
const { authenticateArtisan } = require('../middlewares/authenticateArtisan');
const authController = require('../controllers/authController');

const router = express.Router();

// Routes for user registration and authentication
// router.post('/', skillsController.yourFunction); //api/resources/

router.get('/Matching',authenticateArtisan ,skillsController.skillMatch);











module.exports = router;
