

const FinishedprojectRepository = require('../data/database/finishedprojectRepository');
const finishedprojectRepository = new FinishedprojectRepository();


exports.AllFinishedProjects=(req,res)=>{
  finishedprojectRepository.allFinishedProjects(req, res);
};

exports.getFnishedProjectById=(req,res)=>{
  finishedprojectRepository.allFinishedProjects(req, res);
};


