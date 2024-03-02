const UserRepository = require('../data/database/UserRepository');

const userRepository = new UserRepository();

exports.authenticateNotAdmin = async (req, res, next) => {
  const userType = req.body.usertype;
  
  try {
    if (userType) {
      if (userType === 'admin') {
        return res.status(403).json({ message: 'Admin users are not allowed to sign up.' });
      } 
      next();
    } 
    else {
      res.status(401).json({ message: 'Unauthorized, You must enter the userType!' });
    }
  } catch (error) {
    console.error('Error in authenticateNotAdmin:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
