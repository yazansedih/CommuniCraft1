const LocalpartnershipRepository = require('../data/database/localpartnershipRepository');

const localpartnershipRepository = new LocalpartnershipRepository();


// exports.functionName = (req, res) => { localpartnershipRepository.functionName }
exports.addWorkshop = (req, res) => {
    localpartnershipRepository.addWorkshop(req, res);
  };