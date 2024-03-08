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

  exports.searchAllGroups = (req, res) =>{
    localpartnershipRepository.searchAllGroups(req,res);
  }

  exports.searchGroup = (req, res) => {
    localpartnershipRepository.searchGroup(req,res);
  }

  exports.searchBookedGroup = (req, res) => {
    localpartnershipRepository.searchBookedGroup(req,res);
  }

  exports.groupEmployment = (req, res) => {
    localpartnershipRepository.groupEmployment(req,res);
  }

  exports.layingOffGroup = (req, res) => {
    localpartnershipRepository.layingOffGroup(req,res);
  }

  exports.myProjects = (req, res) => {
    localpartnershipRepository.myProjects(req,res);
  }

  exports.searchProject = (req, res) => {
    localpartnershipRepository.searchProject(req,res);
  }