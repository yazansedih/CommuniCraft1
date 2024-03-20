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

router.delete('/deleteworkshop/:id', authenticateOnwer, localpartnershipController.deleteWorkshop); 

router.get('/searchallgroups', authenticateOnwer, localpartnershipController.searchAllGroups); 
router.get('/searchgroup/:id', authenticateOnwer, localpartnershipController.searchGroup); 
router.get('/searchbookedgroup/:workshopid', authenticateOnwer, localpartnershipController.searchBookedGroup);
router.patch('/:workshopid/groupemployment/:groupid', authenticateOnwer, localpartnershipController.groupEmployment); 
router.delete('/layingoffgroup/:workshopid', authenticateOnwer, localpartnershipController.layingOffGroup)

router.get('/:workshopid/myprojects', authenticateOnwer, localpartnershipController.myProjects); 
router.get('/:workshopid/searchproject/:projectid', authenticateOnwer, localpartnershipController.searchProject);

module.exports = router;
