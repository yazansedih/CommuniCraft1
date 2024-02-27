const UserRepository = require('../data/database/UserRepository');

const userRepository = new UserRepository();

exports.authenticateResearcher = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    if (userId) {
      const userType = await userRepository.getUserType(userId);

      if (userType === 'researcher') {
        // User is an researcher, proceed to the next middleware or route handler
        next();
      } else {
        // User is not an researcher, deny access
        res
          .status(401)
          .json({ message: 'Unauthorized, You are not an researcher!' });
      }
    } else {
      // User is not logged in, deny access
      res.status(401).json({ message: 'Unauthorized, You are not logged in!' });
    }
  } catch (error) {
    // Handle errors in the authenticateAdmin middleware
    console.error('Error in authenticateResearcher:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
