const CompaniesRepository = require('../data/database/companiesRepository');

const companiesRepository = new CompaniesRepository();


// exports.functionName = (req, res) => { companiesRepository.functionName }
exports.loginCompany = async (req, res) => {
    try {
      if (req.session.companyId) {
        return res.status(208).json({ message: 'Company is already logged in.' });
      }
      companiesRepository.loginCompany(req, res);
  
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: error.message || 'Internal server error.' });
    }
  };

  exports.logoutCompany = (req, res) => {
    companiesRepository.logoutCompany(req, res);
  };

  exports.getCompanyProfile = (req, res) => {
    companiesRepository.getCompanyProfile(req, res);
  };
  
  exports.updateCompanyProfile = (req, res) => {
    companiesRepository.updateCompanyProfile(req, res);
  };
  
  exports.deleteCompany = (req, res) => {
    companiesRepository.deleteCompany(req, res);
  };

  exports.searchAllWorkshops = (req,res) => {
    companiesRepository.searchAllWorkshops(req, res);
  }

  exports.searchWorkshop = (req,res) => {
    companiesRepository.searchWorkshop(req, res);
  }

  exports.searchWorkshopiSupport = (req, res) => {
    companiesRepository.searchWorkshopiSupport(req, res);
  }

  exports.provideSupportWorkshop = (req,res) => {
    companiesRepository.provideSupportWorkshop(req, res);
  }

  exports.cancelSupportWorkshop = (req,res) => {
    companiesRepository.cancelSupportWorkshop(req, res);
  }

  exports.sendMessage = (req, res) => {
    companiesRepository.sendMessage(req,res);
  }

  exports.receivedMessages = (req, res) => {
    companiesRepository.receivedMessages(req,res);
  }

  exports.sentMessages = (req, res) => {
    companiesRepository.sentMessages(req,res);
  }

  exports.deleteMessage = (req, res) => {
    companiesRepository.deleteMessage(req,res);
  }

  exports.deleteMessageHistory = (req, res) => {
    companiesRepository.deleteMessageHistory(req,res);
  }