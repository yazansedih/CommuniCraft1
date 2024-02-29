const express = require('express');
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authenticateUser');
const authController = require('../controllers/authController');

const router = express.Router();

// Routes for user registration and authentication
router.post('/signup', authController.signup); //api/users/signup
// router.post('/signup', userController.registerUser); //api/users/signup
router.post('/login', userController.loginUser);

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
  
  
router.get('/skill',authenticateUser ,userController.skillMatch);

  
router.delete('/delete', authenticateUser, userController.deleteAccount);


// router.get('/sameUsers', authenticateUser, userController.getSameUsers);
// router.post('/interests', authenticateUser, userController.addInterests);
// router.get('/interests', authenticateUser, userController.getInterests);
// router.post(
//   '/contribution',
//   authenticateUser,
//   userController.createContribution,
// );
// router.get(
//   '/contributions',
//   authenticateUser,
//   userController.getUsersContributions,
// );

// router.get(
//   '/receivedMessages',
//   authenticateUser,
//   userController.getReceivedMessages,
// );
// router.get('/sentMessages', authenticateUser, userController.getSentMessages);
// router.post('/sendMessage', authenticateUser, userController.sendMessage);

// // Route to search for users
// router.get('/search/:username', authenticateUser, userController.searchUser);


// // Route to log out (invalidate the token or session)
router.get('/logout', authenticateUser, userController.logoutUser);

module.exports = router;
