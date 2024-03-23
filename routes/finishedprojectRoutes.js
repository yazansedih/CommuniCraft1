

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authenticateUser');
const FinishedprojectController = require('../controllers/finishedprojectController');


router.get('/allfinishedproject', authenticateUser, FinishedprojectController.AllFinishedProjects);
router.get('/finishedproject/:id', authenticateUser, FinishedprojectController.getFnishedProjectById);


module.exports = router;
