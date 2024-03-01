const UserRepository = require('../data/database/UserRepository');

const userRepository = new UserRepository();

exports.registerUser = (req, res) => {
  userRepository
    .registerUser(req, res)
    .then((message) => {
      res.status(201).json({ message }); // Registration was successful, return the success message
    })
    .catch((error) => {
      res.status(400).json({ message: error }); // Registration encountered an error, return the error message
    });
};

exports.loginUser = async (req, res) => {
  try {
    if (req.session.userId) {
      return res.status(208).json({ message: 'User is already logged in.' });
    }
    userRepository.loginUser(req, res);

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: error.message || 'Internal server error.' });
  }
};

exports.logoutUser = (req, res) => {
  userRepository.logoutUser(req, res);
};

exports.getUserProfile = (req, res) => {
  userRepository.getUserProfile(req, res);
};

exports.updateUserProfile = (req, res) => {
  userRepository.updateUserProfile(req, res);
};

exports.deleteAccount = (req, res) => {
  userRepository.deleteAccount(req, res);
};



// exports.searchUser = (req, res) => {
//   userRepository.searchUser(req, res);
// };




// exports.getSameUsers = (req, res) => {
//   userRepository.getSameUsers(req, res);
// };

// exports.getReceivedMessages = (req, res) => {
//   userRepository.getReceivedMessages(req, res);
// };

// exports.getSentMessages = (req, res) => {
//   userRepository.getSentMessages(req, res);
// };

// exports.sendMessage = (req, res) => {
//   userRepository.sendMessage(req, res);
// };

// exports.getUsersContributions = (req, res) => {
//   userRepository.getUsersContributions(req, res);
// };

// exports.createContribution = (req, res) => {
//   userRepository.createContribution(req, res);
// };

// exports.addInterests = async (req, res) => {
//   try {
//     const interests = req.body;
//     const userId = req.session.userId;

//     await userRepository.addInterests(userId, interests);

//     // Send a success response
//     res.status(201).json({ message: 'Interests added successfully.' });
//   } catch (error) {
//     // Handle errors and send an appropriate response
//     console.error('Error adding interests:', error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// };

// exports.getInterests = async (req, res) => {
//   const userId = req.session.userId;

//   try {
//     // Fetch user interests from the repository
//     const interests = await userRepository.getUserInterests(userId);

//     // Return the interests as a JSON response
//     res.json({ interests });
//   } catch (error) {
//     console.error('Error fetching user interests:', error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// };
