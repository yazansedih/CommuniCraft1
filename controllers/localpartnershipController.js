const LocalpartnershipRepository = require('../data/database/localpartnershipRepository');

const localpartnershipRepository = new LocalpartnershipRepository();


// exports.functionName = (req, res) => { localpartnershipRepository.functionName }
exports.addWorkshop = (req, res) => {
    localpartnershipRepository.addWorkshop(req, res);
  };

  exports.getWorkshopProfile = (req, res) => {
    localpartnershipRepository.getWorkshopProfile(req, res);
  };

  exports.updateWorkshopProfile = (req, res) => {
    localpartnershipRepository.updateWorkshopProfile(req, res);
  }

  exports.deleteWorkshop = (req, res) => {
    localpartnershipRepository.deleteWorkshop(req, res);
  }