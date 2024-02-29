const express = require('express');
const resourcesController = require('../controllers/resourcesController');
const { authenticateUser } = require('../middlewares/authenticateUser');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/addResource',authenticateUser, resourcesController.addResource);
router.put('/updateResource/:id', authenticateUser,resourcesController.updateResource);
router.delete('/deleteResource/:id',authenticateUser, resourcesController.deleteResource);


router.post('/printAll', authenticateUser,resourcesController.printAll);
router.get('/availableResource',authenticateUser,resourcesController.availableResource);
router.get('/ResourceMaxcoast/:maxcoast',authenticateUser,resourcesController.ResourceMaxcoast);












module.exports = router;
