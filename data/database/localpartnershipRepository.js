const ScoreRepository = require('./ScoreRepository');
const scoreRepository = new ScoreRepository();

const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'advdatabase',
});

class LocalpartnershipRepository {

  addWorkshop(req, res) {
    const { userId } = req.session;
    const { workshopname, location, description, contactinfo , groupsize, cost } = req.body;

    const sql = 'INSERT INTO localpartnerships (WorkshopName, Location, Description, ContactInfo , Cost, OwnerID) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [workshopname, location, description, contactinfo , cost, userId], (error, results) => {
        if (error) {
            console.error('Error inserting project:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Workshop added successfully', workshopId: results.insertId });
    });
  }

  getWorkshopProfile(req, res) {
    const { workshopId } = req.params; 

    const sql = 'SELECT * FROM localpartnerships WHERE WorkshopID = ?';
    db.query(sql, [workshopId], (error, results) => {
        if (error) {
            console.error('Error searching for Workshop:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

       
        if (results.length === 0) {
            return res.status(404).json({ error: 'Workshop not found' });
        }

        
        res.status(200).json({ Workshop: results[0] });
    });
  }

  updateWorkshopProfile(req, res) {
    const { userId } = req.session;
    const { workshopId } = req.params; 
    const { Workshopname, Location, Email, CraftSkill, CraftInterest, ProfilePicture } = req.body.user;

    // Check if the user exists
    db.query(
      'SELECT * FROM users WHERE UserID = ? AND Active = 1',
      [userId],
      (error, results) => { 
        if (error) { 
          return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: 'User not found.' });
        }

        // Prepare an update query based on the fields the user wants to update
        const updateFields = [];
        const updateValues = [];

        if (Username) {
          updateFields.push('Username = ?');
          updateValues.push(Username);
        }
        if (Password) {
            updateFields.push('Password = ?');
            updateValues.push(Password);          
        }
        if (Email) {
          updateFields.push('Email = ?');
          updateValues.push(Email);
        }
        // if (Role) {
        //   updateFields.push('Role = ?');
        //   updateValues.push(Role);
        // }

        // Handle craftskill (assuming craftskill is a JSON data type)
        if (CraftSkill) {
          updateFields.push(`CraftSkill = ?`);
          updateValues.push(CraftSkill);
        }

        // Handle craftinterest (assuming craftinterest is a JSON data type)
        if (CraftInterest && Array.isArray(CraftInterest)) {
          // Convert the array of strings to JSON format
          const craftInterestJSON = JSON.stringify(CraftInterest);

          // Update the CraftInterest field with the JSON string
          updateFields.push('CraftInterest = ?');
          updateValues.push(craftInterestJSON);
        }

        if (ProfilePicture) {
          updateFields.push('ProfilePicture = ?');
          updateValues.push(ProfilePicture);
        }
        
        if (updateFields.length === 0) {
          return res
            .status(400)
            .json({ message: 'No valid fields to update.' });
        }

        if (Password) {
          console.log(Password);
          // Hash the password before storing it 
          bcrypt.hash(Password, 10, (hashError, hashedPassword) => {
            if (hashError) {
              return reject('Password update failed.');
            }
        
            // Construct the parameterized update query
            const updateQuery = `UPDATE users SET Password = ? WHERE UserID = ?`;
        
            // Combine the values for the query
            const queryValues = [hashedPassword, userId];
        
            // Execute the parameterized query
            db.query(updateQuery, queryValues, (updateError) => {
              if (updateError) {
                return res.status(500).json({ message: 'Password update failed.' });
              }
        
              return res.json({ message: 'Password updated successfully.' });
            });
          });
        } 
        else {
          // Construct the parameterized update query
          const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE UserID = ?`;
        
          // Combine the values for the query
          const queryValues = [...updateValues, userId];
        
          // Execute the parameterized query
          db.query(updateQuery, queryValues, (updateError) => {
            if (updateError) {
              return res.status(500).json({ message: 'Profile update failed.' });
            }
        
            return res.json({ message: 'Profile updated successfully.' });
          });
        }
             
      },
    );
  }
  
  

}

module.exports = LocalpartnershipRepository;