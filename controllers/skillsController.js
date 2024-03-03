const SkillsRepository = require('../data/database/skillsRepository');

const skillsRepository = new SkillsRepository();

// exports.functionName = (req, res) => { skillsRepository.functionName }



exports.skillMatch = async(req, res) => {
   skillsRepository.skillMatch(req, res);
};