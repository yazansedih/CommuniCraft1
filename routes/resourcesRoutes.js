const express = require('express');
const resourcesController = require('../controllers/resourcesController');
const { authenticateUser } = require('../middlewares/authenticateUser');
const { authenticateArtisan } = require('../middlewares/authenticateArtisan');


const authController = require('../controllers/authController');

const router = express.Router();

router.post('/addResource',authenticateArtisan, resourcesController.addResource);
router.put('/updateResource/:id', authenticateArtisan,resourcesController.updateResource);
router.delete('/deleteResource/:id',authenticateArtisan, resourcesController.deleteResource);
router.get('/countMyResources',authenticateArtisan,resourcesController.countMyResources);



router.get('/printAll', authenticateArtisan,resourcesController.printAll);
router.get('/printmyResource', authenticateArtisan,resourcesController.printmyResource);

router.get('/availableResource',authenticateArtisan,resourcesController.availableResource);
router.get('/ResourceMaxcoast/:maxcoast',authenticateArtisan,resourcesController.ResourceMaxcoast);












module.exports = router;
