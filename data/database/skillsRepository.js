const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'advdatabase',
});

class SkillsRepository {
    // write your functions ...
  
  skillMatch = async(req, res) => {
    const { userId } = req.session;
    const arrayofSkill = [];
    const arrayofInterest = [];
    const matchingPairs= [];
    const matchingInterestPairs= [];
    


    try {  
    // const { CraftSkill, CraftInterest } = req.body;

      // Retrieve data from the database based on CraftSkill 
      db.query('SELECT CraftSkill FROM users WHERE UserID = ?',
      [userId], 
      (error, skillResult) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }
        console.log('Retrieved data:', skillResult);//for test 
        arrayofSkill.push(skillResult);//save result of skill result

        console.log('List of Skill:', arrayofSkill);//test
        for (let i = 0; i < arrayofSkill.length; i++) {
          for (let j = i + 1; j < arrayofSkill.length; j++) {
              if (arrayofSkill[i].CraftSkill === arrayofSkill[j].CraftSkill) {
                  // Save information about matching pair
                  matchingPairs.push({
                      skill: arrayofSkill[i].CraftSkill,
                      index1: i,
                      index2: j
                  });
              }
          }
      }
      console.log('Matching Skill Pairs:', matchingPairs);
      res.status(200).json({ success: true, data: matchingPairs });


      });
      
      db.query('SELECT CraftInterest FROM users WHERE UserID = ?',
      
      [userId], 
      (error, interestResult) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }
        console.log('Retrieved data:', interestResult);//for test 
        arrayofInterest.push(interestResult);//save result of interest result
        //arrayofInterest = interesetResult.map((row) => row.CraftInterest);
        
        console.log('List of Interest:', arrayofInterest);//test

    // search in array of interest for mathcing intereset
    for (let i = 0; i < arrayofInterest.length; i++) {
    for (let j = i + 1; j < arrayofInterest.length; j++) {
        if (arrayofInterest[i].CraftInterest === arrayofInterest[j].CraftInterest) {
            // Save information about matching pair
            matchingInterestPairs.push({
                interest: arrayofInterest[i].CraftInterest,
                index1: i,
                index2: j
            });
        }
    }
    }

    console.log('Matching Interest Pairs:', matchingInterestPairs);
        });
        


      } catch (error) {
        console.error('Error in matching function:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

  };
}

module.exports = SkillsRepository;