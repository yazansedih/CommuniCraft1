const ScoreRepository = require('./ScoreRepository');
const scoreRepository = new ScoreRepository();

const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection
  ({ host: 'localhost', user: 'root', password: '123456', database: 'advdatabase', });


class SkillsRepository {

  skillMatch = async (req, res) => {
    const { userId } = req.session;
    let rating = 3;
    let initSize = 1;
    var advancedCount = 0
    var amateurCount = 0
    var beginnerCount = 0;
    var UserGroupID;
    const advancedRate = 5;
    const amateurRate = 3;
    const beginnerRate = 1;

    try {
      // get data from database selected CraftInterest
      db.query('SELECT * FROM users WHERE UserID = ?', [userId], (error, interestResultUserLog) => {
        if (error || interestResultUserLog.length <= 0) {
          console.error('Error executing query:', error);
          return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

        var interests = JSON.parse(interestResultUserLog[0].CraftInterest);

        const craftInterestJSON = interests && Array.isArray(interests) ? JSON.stringify(interests) : null;

        // Perform matching of users with similar interests
        db.query('SELECT * FROM `group` WHERE CraftInterest =? AND Size <5', [craftInterestJSON], (error, interestResult) => {
          if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
          }

          var interestSize = 0;



          if (interestResult.length === 0) {
           
            db.query('INSERT INTO `group` (CraftInterest, Size, Rating, Status) VALUES (?, ?, ?, ?)', [craftInterestJSON, initSize, rating, '0'], (error, result) => {
              if (error) {
                console.error('Error executing query:', error);
                return res.status(500).json({ success: false, error: 'Internal Server Error' });
              }

              return res.status(201).json({ success: true, message: 'Create Group Matching successfully.' });
            });
          }
          else{
          db.query('SELECT CraftSkill FROM `users` WHERE GroupID =?', [interestResult[0].GroupID], (error, skillresult) => {
            console.log('group',interestResult[0].GroupID);

            //  1 3 5          15/9 -> 1 -.4 = .6 
            console.log('result',skillresult.length);
            for (var i = 0; i < skillresult.length; i++) {
             // console.log('skill reuslt',skillresult[i].CraftSkill);
              if (skillresult[i].CraftSkill === 'Advanced') {
                advancedCount++;
                console.log('counter AAA',advancedCount);
              
              }
              else if (skillresult[i].CraftSkill === 'Amateur') {//a
                amateurCount++;
                console.log('counter BBB',amateurCount);
              }
              else if (skillresult[i].CraftSkill === 'Beginner') {
                beginnerCount++;
                console.log('counter CCC',beginnerCount);


              }

            }
            const totalRating = (advancedCount * advancedRate) +
              (amateurCount * amateurRate) +
              (beginnerCount * beginnerRate);

            // Normalize to a scale of 5
            const maxPossibleRating = (advancedRate * advancedCount) +
              (amateurRate * amateurCount) +
              (beginnerRate * beginnerCount);

             rating = (totalRating / maxPossibleRating) * 5;
             console.log('rating',rating);
            //rating=maxPossibleRating
            db.query('UPDATE `group` SET Rating = ? WHERE GroupID = ?', [rating, interestResult[0].GroupID], (error) => {
              if (error) {
                console.error('Error executing query:', error);
                return res.status(500).json({ success: false, error: 'Internal Server Error' });
              }
              else {
                return res.status(200).json({ success: true, message: 'Group Matching successfully.' });
              }
            });
            //console.log(rating);ss
          });
          
          ////
          db.query('UPDATE users SET GroupID = ? WHERE userID = ?', [interestResult[0].GroupID, userId], (error, result) => {
            if (error) {
              console.error('Error executing query:', error);
              return res.status(500).json({ success: false, error: 'Internal Server Error' });
            }
            var newSize = interestResult[0].Size + 1;

            db.query('UPDATE `group` SET Size = ? WHERE GroupID = ?', [newSize, interestResult[0].GroupID], (error) => {
              if (error) {
                console.error('Error executing query:', error);
                return res.status(500).json({ success: false, error: 'Internal Server Error' });
              }
              else {
              //  return res.status(200).json({ success: true, message: 'Group Matching successfully.' });
              }
            });

          });
        }
        
        });
      });
    } catch (error) {
      console.error('Error in matching function:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };


}




module.exports = SkillsRepository;
