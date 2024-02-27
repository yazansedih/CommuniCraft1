const UserRepository = require('../data/database/UserRepository');

const userRepository = new UserRepository();

exports.authenticateAdmin = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    if (userId) {
      const userType = await userRepository.getUserType(userId);

      if (userType === 'admin') {
        // User is an admin, proceed to the next middleware or route handler
        next();
      } else {
        // User is not an admin, deny access
        res
          .status(401)
          .json({ message: 'Unauthorized, You are not an admin!' });
      }
    } else {
      // User is not logged in, deny access
      res.status(401).json({ message: 'Unauthorized, You are not logged in!' });
    }
  } catch (error) {
    // Handle errors in the authenticateAdmin middleware
    console.error('Error in authenticateAdmin:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
