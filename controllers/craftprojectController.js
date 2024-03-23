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
    craftprojectRepository.searchALLprojects(req,res);
  };
  // exports.searchprojectbySkillLevel= (req, res) => {
  //   craftprojectRepository.searchprojectbySkillLevel(req,res);
  // };
  // exports.searchprojectbyGroupSize= (req, res) => {
  //   craftprojectRepository.searchprojbyGroupSize(req,res);
  // };
  exports.searchprojectbyContainTitle= (req, res) => {
    craftprojectRepository.searchprojectbyContainTitle(req,res);
  };
  // exports.getTitleById= (req, res) => {
  //   craftprojectRepository.getTitleById(req,res);
  // };
  
  exports.searchprojectbymaterial= (req, res) => {
    craftprojectRepository.searchprojectbymaterial(req,res);
  };
  exports.myProjects= (req, res) => {
    craftprojectRepository. myProjects(req,res);
  };
  exports.countALLprojects= (req, res) => {
    craftprojectRepository. countALLprojects(req,res);
  };
  exports.countMyprojects= (req, res) => {
    craftprojectRepository. countMyprojects(req,res);
  };
  exports.  workshop= (req, res) => {
    craftprojectRepository.   workshop(req,res);
  };

  
  
  
