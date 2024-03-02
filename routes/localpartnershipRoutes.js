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
  .patch('/profile/workshopname/:id', authenticateOnwer, localpartnershipController.updateWorkshopProfile)
  .patch('/profile/location/:id', authenticateOnwer, localpartnershipController.updateWorkshopProfile)
  .patch('/profile/description/:id', authenticateOnwer, localpartnershipController.updateWorkshopProfile)
  .patch('/profile/contactinfo/:id', authenticateOnwer, localpartnershipController.updateWorkshopProfile)
  .patch('/profile/cost/:id', authenticateOnwer, localpartnershipController.updateWorkshopProfile)







// router.get('/searchgroups', authenticateOnwer, localpartnershipController.searchGroups); 
// router.post('/groupemployment', authenticateOnwer, localpartnershipController.groupEmployment); 

// router.post('/deleteworkshop', authenticateOnwer, localpartnershipController.deleteWorkshop); 

module.exports = router;
