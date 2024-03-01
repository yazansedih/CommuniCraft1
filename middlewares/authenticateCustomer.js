const UserRepository = require('../data/database/UserRepository');

const userRepository = new UserRepository();

exports.authenticateCustomer = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    if (userId) {
      const userType = await userRepository.getUserType(userId);

      if (userType === 'customer') {
        next();
      } else {
        res
          .status(401)
          .json({ message: 'Unauthorized, You are not an customer!' });
      }
    } else {
      // User is not logged in, deny access
      res.status(401).json({ message: 'Unauthorized, You are not logged in!' });
    }
  } catch (error) {
    // Handle errors in the authenticateCustomer middleware
    console.error('Error in authenticateCustomer:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
