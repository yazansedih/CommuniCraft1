const UserRepository = require('../data/database/UserRepository');
const userRepository = new UserRepository();

exports.ACA = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    if (userId) {
      const userType = await userRepository.getUserType(userId);

      // Check if the user is an admin or any other specified role
      if (userType === 'admin' || userType === 'Admin' || userType === 'customer' || userType === 'Customer' || userType === 'artisan' || userType === 'Artisan') {
        // User is an admin or any other specified role, proceed to the next middleware or route handler
        next();
      } else {
        // User is not authorized, deny access
        res.status(401).json({ message: 'Unauthorized, You are not authorized!' });
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
