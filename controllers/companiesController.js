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