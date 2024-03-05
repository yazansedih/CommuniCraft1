const express = require('express');
const externalAPIsController = require('../controllers/externalAPIsController');
const { authenticateNotAdmin } = require('../middlewares/authenticateNotAdmin');
const { authenticateArtisan } = require('../middlewares/authenticateArtisan');
const { authenticateUser } = require('../middlewares/authenticateUser');

const router = express.Router();

router.get('/weather/:workshopid', authenticateUser, externalAPIsController.weather);

module.exports = router;
