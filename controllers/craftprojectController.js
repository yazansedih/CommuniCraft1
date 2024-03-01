const CraftprojectRepository = require('../data/database/craftprojectRepository');

const craftprojectRepository = new CraftprojectRepository();


exports.addproject= (req, res) => {
    craftprojectRepository.addproj(req,res);
  };
  exports.updateproject= (req, res) => {
    craftprojectRepository.updateproj(req,res);
  };
  exports.deleteproject= (req, res) => {
    craftprojectRepository.deleteproj(req,res);
  };
  exports.searchproject= (req, res) => {
    craftprojectRepository.searchproj(req,res);
  };
  exports.searchALLprojects= (req, res) => {
    craftprojectRepository.searchallprojs(req,res);
  };
  exports.searchprojectbySkillLevel= (req, res) => {
    craftprojectRepository.searchprojbySkillLevel(req,res);
  };
  exports.searchprojectbyGroupSize= (req, res) => {
    craftprojectRepository.searchprojbyGroupSize(req,res);
  };
  exports.searchprojectbyTitle= (req, res) => {
    craftprojectRepository.searchprojbyTitle(req,res);
  };
  exports.getTitleById= (req, res) => {
    craftprojectRepository.getTitleById(req,res);
  };
  
  exports.  searchprojectbymaterial= (req, res) => {
    craftprojectRepository.  searchprojectbymaterial(req,res);
  };
