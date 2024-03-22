const express = require('express');
const localpartnershipController = require('../controllers/localpartnershipController');
const { authenticateOnwer } = require('../middlewares/authenticateOwner');
const { authenticateWorkshop } = require('../middlewares/authenticateWorkshop');
const authController = require('../controllers/authController');
const UserRepository = require('../data/database/UserRepository');

const router = express.Router();

// Routes for user registration and authentication
router.post('/addworkshop', authenticateOnwer, localpartnershipController.addWorkshop); 

router.get('/myWorkshops', authenticateOnwer, localpartnershipController.myWorkshops)
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

router.get('/:workshopid/pendingprojects', authenticateOnwer, localpartnershipController.pendingProjects); 
router.post('/:workshopid/acceptproject', authenticateOnwer, localpartnershipController.acceptProject); 
router.get('/:workshopid/myprojects', authenticateOnwer, localpartnershipController.myProjects); 
router.get('/:workshopid/searchproject/:projectid', authenticateOnwer, localpartnershipController.searchProject);
router.patch('/:workshopid/workshopProfile/cost/:projectid', authenticateOnwer, localpartnershipController.updateCost);
router.delete('/:workshopid/layingoffproject/:projectid', authenticateOnwer, localpartnershipController.layingOffProject);
router.patch('/:workshopid/finishproject/:projectid', authenticateOnwer, localpartnershipController.finishProject);

router.post('/communication/sendMessage/:workshopid', authenticateOnwer, localpartnershipController.sendMessage);
router.get('/communication/receivedMessages/:workshopid', authenticateOnwer, localpartnershipController.receivedMessages);
router.get('/communication/sentMessages/:workshopid', authenticateOnwer, localpartnershipController.sentMessages);
router.delete('/:workshopid/communication/deleteMessage/:messageid', authenticateOnwer, localpartnershipController.deleteMessage);
router.delete('/communication/deleteMessageHistory/:workshopid', authenticateOnwer, localpartnershipController.deleteMessageHistory);


module.exports = router;
