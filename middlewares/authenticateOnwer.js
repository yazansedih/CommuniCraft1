const UserRepository = require('../data/database/UserRepository');

const userRepository = new UserRepository();

exports.authenticateOnwer = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    if (userId) {
      const userType = await userRepository.getUserType(userId);

      if (userType === 'onwer') {
        next();
      } else {
        res
          .status(401)
          .json({ message: 'Unauthorized, You are not an onwer!' });
      }
    } else {
      res.status(401).json({ message: 'Unauthorized, You are not logged in!' });
    }
  } catch (error) {
    // Handle errors in the authenticateOnwer middleware
    console.error('Error in authenticateOnwer:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
