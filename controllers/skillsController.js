const SkillsRepository = require('../data/database/skillsRepository');

const skillsRepository = new SkillsRepository();

// exports.functionName = (req, res) => { skillsRepository.functionName }



exports.skillMatch = async(req, res) => {
    try {
      
      const { CraftSkill, CraftInterest } = req.body;
  
      // Retrieve data from the database based on CraftSkill and CraftInterest
      const matchingData = await database.query('SELECT * FROM users WHERE CraftSkill = ? AND CraftInterest = ?', [CraftSkill, CraftInterest]);
  
      // Return the matching data
      res.status(200).json({ success: true, data: matchingData });
    } catch (error) {
      console.error('Error in skillMatch function:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};