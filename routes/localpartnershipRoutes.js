const express = require('express');
const localpartnershipController = require('../controllers/localpartnershipController');
const { authenticateOnwer } = require('../middlewares/authenticateOwner');
const { authenticateWorkshop } = require('../middlewares/authenticateWorkshop');
const authController = require('../controllers/authController');
const UserRepository = require('../data/database/UserRepository');

const router = express.Router();

// Routes for user registration and authentication
router.post('/addworkshop', authenticateOnwer, localpartnershipController.addWorkshop); 

router.get('/workshopProfile/:id', authenticateOnwer, localpartnershipController.getWorkshopProfile)

router
  .patch('/workshopProfile/workshopname/:id', authenticateOnwer, localpartnershipController.updateWorkshopProfile)
  .patch('/workshopProfile/location/:id', authenticateOnwer, localpartnershipController.updateWorkshopProfile)
  .patch('/workshopProfile/description/:id', authenticateOnwer, localpartnershipController.updateWorkshopProfile)
  .patch('/workshopProfile/contactinfo/:id', authenticateOnwer, localpartnershipController.updateWorkshopProfile)
  .patch('/workshopProfile/cost/:id', authenticateOnwer, localpartnershipController.updateWorkshopProfile)


// router.get('/searchgroups', authenticateOnwer, localpartnershipController.searchGroups); 
// router.post('/groupemployment', authenticateOnwer, localpartnershipController.groupEmployment); 

router.delete('/deleteworkshop/:id', authenticateOnwer, localpartnershipController.deleteWorkshop); 

module.exports = router;
