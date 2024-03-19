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

exports.showPending = (req, res) => {
  userRepository.showPending(req, res);
}

exports.acceptUserPending = (req, res) => {
  userRepository.acceptUserPending(req, res);
}

exports.acceptCompanyPending = (req, res) => {
  userRepository.acceptCompanyPending(req, res);
}

exports.rejectUserPending = (req, res) => {
  userRepository.rejectUserPending(req, res);
}

exports.rejectCompanyPending = (req, res) => {
  userRepository.rejectCompanyPending(req, res);
}

exports.getSystemReport = (req, res) => {
  userRepository.getSystemReport((err, systemReport) => {
    if (err) {
      console.error('Error fetching system report:', err);
      return res.status(500).json({ error: 'Error fetching system report' });
    }
    res.json(systemReport);
  });
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


exports.sendMessageToUser = (req, res) => {
  userRepository.sendMessageToUser(req, res);
}

exports.sendMessageToGroup = (req, res) => {
  userRepository.sendMessageToGroup(req, res);
}

exports.receivedGroupMessages = (req, res)  =>{
  userRepository.receivedGroupMessages(req, res);
}

exports.receivedMessages = (req, res) => {
  userRepository.receivedMessages(req, res);
}

exports.sentMessages = (req, res) => {
  userRepository.sentMessages(req,res);
}

exports.deleteMessage = (req, res) => {
  userRepository.deleteMessage(req,res);
}

exports.deleteMessageHistory = (req, res) => {
  userRepository.deleteMessageHistory(req,res);
}

