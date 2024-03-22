const LocalpartnershipRepository = require('../data/database/localpartnershipRepository');

const localpartnershipRepository = new LocalpartnershipRepository();


exports.addWorkshop = (req, res) => {
    localpartnershipRepository.addWorkshop(req, res);
  };

  exports.myWorkshops = (req, res) => {
    localpartnershipRepository.myWorkshops(req, res);
  }

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

  exports.pendingProjects = (req, res) => {
    localpartnershipRepository.pendingProjects(req,res);
  }

  exports.acceptProject = (req, res) => {
    localpartnershipRepository.acceptProject(req,res);
  }

  exports.myProjects = (req, res) => {
    localpartnershipRepository.myProjects(req,res);
  }

  exports.searchProject = (req, res) => {
    localpartnershipRepository.searchProject(req,res);
  }

  exports.updateCost = (req, res) => {
    localpartnershipRepository.updateCost(req,res);
  }

  exports.layingOffProject = (req, res) => {
    localpartnershipRepository.layingOffProject(req,res);
  }

  exports.finishProject = (req, res) => {
    localpartnershipRepository.finishProject(req, res);
  }

  exports.sendMessage = (req, res) => {
    localpartnershipRepository.sendMessage(req,res);
  }

  exports.receivedMessages = (req, res) => {
    localpartnershipRepository.receivedMessages(req,res);
  }

  exports.sentMessages = (req, res) => {
    localpartnershipRepository.sentMessages(req,res);
  }

  exports.deleteMessage = (req, res) => {
    localpartnershipRepository.deleteMessage(req,res);
  }

  exports.deleteMessageHistory = (req, res) => {
    localpartnershipRepository.deleteMessageHistory(req,res);
  }