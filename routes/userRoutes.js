const express = require('express');
const userController = require('../controllers/userController');
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');
const { authenticateNotAdmin } = require('../middlewares/authenticateNotAdmin');
const { authenticateArtisan } = require('../middlewares/authenticateArtisan');
const { authenticateUser } = require('../middlewares/authenticateUser');
const authController = require('../controllers/authController');

const router = express.Router();

// Routes for user registration and authentication
router.post('/signup', authenticateNotAdmin, authController.signup); //api/users/signup
// router.post('/signup', userController.registerUser); //api/users/signup
router.post('/login', userController.loginUser);

router.get('/showpending', authenticateAdmin, userController.showPending);
router.patch('/acceptUserPending/:userid', authenticateAdmin, userController.acceptUserPending);
router.patch('/acceptCompanyPending/:companyid', authenticateAdmin, userController.acceptCompanyPending);
router.delete('/rejectUserPending/:userid', authenticateAdmin, userController.rejectUserPending);
router.delete('/rejectCompanyPending/:companyid', authenticateAdmin, userController.rejectCompanyPending);

router.get('/system-report', authenticateAdmin, userController.getSystemReport);
router.get('/system-report-companies', authenticateAdmin, userController.getSystemReportCompanies);
router.get('/system-report-workshops', authenticateAdmin, userController.getSystemReportWorkshops);
router.get('/system-report-projects', authenticateAdmin, userController.getSystemReportProjects);

router
  .route('/profile')
  .get(authenticateUser, userController.getUserProfile)
  .put(authenticateUser, userController.updateUserProfile);

router
  .patch('/profile/username', authenticateUser, userController.updateUserProfile)
  .patch('/profile/password', authenticateUser, userController.updateUserProfile)
  .patch('/profile/email', authenticateUser, userController.updateUserProfile)
  .patch('/profile/craftskill', authenticateUser, userController.updateUserProfile)
  .patch('/profile/craftinterest', authenticateUser, userController.updateUserProfile)
  .patch('/profile/profilepicture', authenticateUser, userController.updateUserProfile)
  .patch('/profile/partnershipid', authenticateUser, userController.updateUserProfile);
  
router.delete('/delete', userController.deleteAccount);

router.get('/logout', authenticateUser, userController.logoutUser);


router.post('/communication/sendmessagetouser', authenticateUser, userController.sendMessageToUser);
router.post('/communication/sendmessagetogroup', authenticateUser, userController.sendMessageToGroup);
router.get('/communication/receivedMessages', authenticateUser, userController.receivedMessages);
router.get('/communication/sentMessages', authenticateUser, userController.sentMessages);
router.get('/communication/receivedGroupMessages', authenticateUser, userController.receivedGroupMessages);

router.delete('/communication/deleteMessage/:messageid', authenticateUser, userController.deleteMessage);
router.delete('/communication/deleteMessageHistory', authenticateUser, userController.deleteMessageHistory);


module.exports = router;
