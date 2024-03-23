const mysql = require('mysql2');
require('dotenv').config();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'advdatabase',
});

class ScoreRepository {
  // Initialize scores to 0 for both contributions and data
  contributionsScore = 0;
  dataScore = 0;

  userExists(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT 1 FROM scores WHERE UserID = ? LIMIT 1',
        [userId],
        (error, results) => {
          if (error) {
            console.error('Error checking if user exists:', error);
            reject(error);
          } else {
            const exists = results.length > 0;
            resolve(exists);
          }
        },
      );
    });
  }

  // Update or insert contributions score
  updateOrInsertContributionsScore(userId, contributionValue) {
    const timestamp = new Date();
    this.contributionsScore =
      Math.floor(this.contributionsScore + contributionValue) + 1;
    if (contributionValue < 1) contributionValue = 1;

    const description = `Contributions score increased by ${contributionValue}`;

    return this.userExists(userId).then((exists) => {
      return new Promise((resolve, reject) => {
        if (exists) {
          db.query(
            'UPDATE scores SET ContributionScore = ?, Timestamp = ?, ScoreDescription = ? WHERE UserID = ?',
            [this.contributionsScore, timestamp, description, userId],
            (updateError, updateResults) => {
              if (updateError) {
                console.error(
                  'Error updating contributions score in the database:',
                  updateError,
                );
                reject(updateError);
              } else {
                console.log('Contributions score updated successfully.');
                resolve('Contributions score updated successfully.');
              }
            },
          );
        } else {
          db.query(
            'INSERT INTO scores (UserID, ContributionsScore, Timestamp, ScoreDescription) VALUES (?, ?, ?, ?)',
            [userId, this.contributionsScore, timestamp, description],
            (insertError, insertResults) => {
              if (insertError) {
                console.error(
                  'Error inserting new contributions score in the database:',
                  insertError,
                );
                reject(insertError);
              } else {
                console.log('New contributions score created successfully.');
                resolve('New contributions score created successfully.');
              }
            },
          );
        }
      });
    });
  }

  // Update or insert data score
  updateOrInsertDataScore(userId, dataValue, dataType) {
    const timestamp = new Date();
    let val;

    // Adjust scoring based on data type
    switch (dataType) {
      case ' ':
        val = dataValue * 1.2;
        break;
      case 'Air Quality':
        val = dataValue * 0.2;
        break;
      case 'Temperature':
        val = dataValue * 0.1;
        break;
      case 'Humidity':
        val = dataValue * 0.1;
        break;
      case 'WaterQuality':
        val = dataValue * 0.2;
        break;
      case 'BiodiversityMetrics':
        val = dataValue * 0.2;
        break;
    }

    this.dataScore += val;

    const description = `Data score increased by ${val}`;

    return this.userExists(userId).then((exists) => {
      return new Promise((resolve, reject) => {
        if (exists) {
          db.query(
            'UPDATE scores SET DataScore = ?, Timestamp = ?, ScoreDescription = ? WHERE UserID = ?',
            [this.dataScore, timestamp, description, userId],
            (updateError, updateResults) => {
              if (updateError) {
                console.error(
                  'Error updating data score in the database:',
                  updateError,
                );
                reject(updateError);
              } else {
                console.log('Data score updated successfully.');
                resolve('Data score updated successfully.');
              }
            },
          );
        } else {
          db.query(
            'INSERT INTO scores (UserID, DataScore, Timestamp, ScoreDescription) VALUES (?, ?, ?, ?)',
            [userId, this.dataScore, timestamp, description],
            (insertError, insertResults) => {
              if (insertError) {
                console.error(
                  'Error inserting new data score in the database:',
                  insertError,
                );
                reject(insertError);
              } else {
                console.log('New data score created successfully.');
                resolve('New data score created successfully.');
              }
            },
          );
        }
      });
    });
  }

  // Get scores for a user
  scoreOfUser(req, res) {
    const userId = req.session.userId;

    db.query(
      'SELECT * from scores WHERE userId = ?',
      [userId],
      (error, results) => {
        if (error) {
          console.error('Error querying data from the database:', error);
          const detailedError = `Error querying data from the database: ${error.message}`;
          return res.status(500).json({ message: detailedError });
        }

        if (results.length === 0) {
          return res.status(404).json({
            message: 'Submit data or contributions to start your score!',
          });
        }

        const userScores = results[0]; // Assuming there's only one row per user
        return res.status(200).json({ Scores: userScores });
      },
    );
  }
}

module.exports = ScoreRepository;
