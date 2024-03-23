

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authenticateUser');
const FinishedprojectController = require('../controllers/finishedprojectController');


router.get('/system-report', authenticateUser, FinishedprojectController.getSystemReport);
router.get('', authenticateUser, FinishedprojectController.getSystemReport);
router.get('/:id', authenticateUser, FinishedprojectController.getSystemReport);


module.exports = router;
