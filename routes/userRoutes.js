const express = require('express');
const userController = require('../controllers/userController');
const { authenticateNotAdmin } = require('../middlewares/authenticateNotAdmin');
const { authenticateArtisan } = require('../middlewares/authenticateArtisan');
const { authenticateUser } = require('../middlewares/authenticateUser');
const authController = require('../controllers/authController');

const router = express.Router();

// Routes for user registration and authentication
router.post('/signup', authenticateNotAdmin, authController.signup); //api/users/signup
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
  
router.delete('/delete', userController.deleteAccount);

router.get('/logout', authenticateUser, userController.logoutUser);

module.exports = router;
