exports.authenticateUser = (req, res, next) => {
  const userId = req.session.userId;
  if (userId) {
    next();
  } else {
    // User is not logged in, deny access
    res.status(401).json({ message: 'Unauthorized, You are not a user!' });
  }
};
