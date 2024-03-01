const UserRepository = require('../data/database/UserRepository');

const userRepository = new UserRepository();

exports.authenticateUser = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    if (userId) {
      const userType = await userRepository.getUserType(userId);

      if (userType === 'user') {
        next();
      } else {
        res
          .status(401)
          .json({ message: 'Unauthorized, You are not an user!' });
      }
    } else {
      res.status(401).json({ message: 'Unauthorized, You are not logged in!' });
    }
  } catch (error) {
    // Handle errors in the authenticateUser middleware
    console.error('Error in authenticateUser:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
