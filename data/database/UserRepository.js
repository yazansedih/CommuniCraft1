const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'advdatabase',
});

class UserRepository {

  registerUser(req, res) {
    const { username, password, email, usertype } = req.body;

    return new Promise((resolve, reject) => {
      // Check if the user already exists (Checking the email)
      db.query(
        'SELECT * FROM users WHERE Email = ? OR Username = ? AND Active = 1',
        [username, email],
        (error, results) => {
          if (error) {
            return reject('Internal server error.');
          }

          if (results.length > 0) {
            return reject('Email or username already in use.');
          }

          // Hash the password before storing it
          bcrypt.hash(password, 10, (hashError, hashedPassword) => {
            if (hashError) {
              return reject('User registration failed.');
            }

            const registrationDate = new Date(); // Get the current date and time

            // Create a new user with the hashed password and registration date
            db.query(
              'INSERT INTO users (Username, Password, Email, userType, RegistrationDate) VALUES (?, ?, ?, ?, ?)',
              [username, hashedPassword, email, usertype, registrationDate],
              (insertError) => {
                if (insertError) {
                  console.log(password);

                  return reject('User registration failed.');
                }

                return resolve('User registered successfully.');
              },
            );
          });
        },
      );
    });
  };
  
  loginUser(req, res) {
    
    const { username, password } = req.body;
    // Find the user by username
    db.query(
      'SELECT * FROM users WHERE Username = ? AND Active = 1',
      [username],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid data.' });
        }

        const user = results[0];

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(
          password,
          user.Password,
          (compareError, passwordMatch) => {
            if (compareError) {
              return res
                .status(500)
                .json({ message: 'Internal server error.' });
            }
            if (!passwordMatch) {
              return res.status(401).json({ message: 'Invalid data.' });
            }

            // Update lastLoginDate in the database
            db.query(
              'UPDATE users SET LastLoginDate = CURRENT_TIMESTAMP WHERE UserID = ?',
              [user.UserID],
              (updateError) => {
                if (updateError) {
                  return res
                    .status(500)
                    .json({ message: 'Internal server error.' });
                }
                
                // return res.json({ message: 'Login successful.' });
              },
            );

            req.session.userId = user.UserID; // Store the user's ID in the session
            return res.status(200).json({ message: 'User login successfully.' });
          },
        );
      },
    );
  };

  logoutUser(req, res) {
    const { userId } = req.session;

    db.query(
      'SELECT * FROM users WHERE UserID = ? AND Active = 1',
      [userId],
      (searchError, results) => {
        if (searchError) {
          res.status(500).json({ message: 'Error logging out.' });
        } else if (results.length === 0) {
          res.status(500).json({ message: 'Error logging out.' });
        } else {
          // User is active, destroy the session
          req.session.destroy((err) => {
            if (err) {
              res.status(500).json({ message: 'Error logging out.' });
            } else {
              res.json({ message: 'Logged out successfully.' });
            }
          });
        }
      },
    );
    
  };

  getUserProfile(req, res) {
    const { userId } = req.session;

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

            const userProfile = results[0];
            return res.json({ user: userProfile });
        },
    );
  }

  updateUserProfile(req, res) {
    const { userId } = req.session;
    const { Username, Password, Email, CraftSkill, CraftInterest, ProfilePicture } = req.body.user;

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

  deleteAccount(req, res) {
    const { userId } = req.session;

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

        // Delete
        db.query(
          'DELETE FROM users WHERE UserID = ? AND Active = 1',
          [userId],
          (deleteError, deleteResults) => {
              if (deleteError) {
                  return res.status(500).json({ message: 'User deletion failed.' });
              }
      
              // Check if any rows were affected by the delete operation
              if (deleteResults.affectedRows === 0) {
                  return res.status(404).json({ message: 'User not found.' });
              }
      
              // Destroy the session after deleting the user account
              req.session.destroy((destroyError) => {
                  if (destroyError) {
                      return res.status(500).json({ message: 'Error destroying session.' });
                  }
      
                  return res.json({ message: 'User deleted successfully.' });
              });
          }
      );
      
      },
    );
  }  


   // for middlewares
   getUserType(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT userType FROM users WHERE UserID = ?',
        [userId],
        (error, results) => {
          if (error) {
            reject('Error fetching user type from the database.');
          } else {
            const userType = results[0]?.userType;
            resolve(userType);
          }
        },
      );
    });
  }

}
  module.exports = UserRepository;
