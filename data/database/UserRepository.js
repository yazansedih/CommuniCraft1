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

}
  module.exports = UserRepository;


  // searchUser(req, res) {
  //   const { username } = req.params;

  //   // Find the user by username
  //   db.query(
  //     'SELECT Username, Interests, location, ProfilePicture, SustainabilityScore FROM User WHERE username = ? AND active = 1',
  //     [username],
  //     (error, results) => {
  //       if (error) {
  //         return res.status(500).json({ message: 'Internal server error.' });
  //       }

  //       if (results.length === 0) {
  //         return res.status(401).json({ message: 'Invalid data.' });
  //       }

  //       return res.json({ User: results[0] });
  //     },
  //   );
  // }


  
  // getSameUsers(req, res) {
  //   const { userId } = req.session;

  //   // Retrieve the interests and location of the current user
  //   db.query(
  //     'SELECT interests, location FROM User WHERE userID = ?',
  //     [userId],
  //     (userError, userResults) => {
  //       if (userError) {
  //         return res.status(500).json({ message: 'Internal server error.' });
  //       }

  //       if (userResults.length === 0) {
  //         return res
  //           .status(404)
  //           .json({ message: 'User not found or not active.' });
  //       }

  //       const currentUser = userResults[0];
  //       const userInterests = currentUser.interests;
  //       const userLocation = currentUser.location;

  //       // Retrieve users with similar interests or the same location
  //       db.query(
  //         'SELECT userID, username, interests, location FROM User WHERE userID <> ? AND (JSON_UNQUOTE(JSON_EXTRACT(interests, "$.key")) = ? OR interests IS NULL) AND location = ?',
  //         [userId, '123', userLocation],
  //         (similarUsersError, similarUsersResults) => {
  //           if (similarUsersError) {
  //             console.error('Similar users query error:', similarUsersError);
  //             return res
  //               .status(500)
  //               .json({ message: 'Failed to retrieve similar users.' });
  //           }

  //           // Return the similar users as JSON response
  //           return res.json({ similarUsers: similarUsersResults });
  //         },
  //       );
  //     },
  //   );
  // }

  // getUsersContributions(req, res) {
  //   const { userId } = req.session;

  //   // Check if the user exists and is active
  //   db.query(
  //     'SELECT * FROM User WHERE userID = ? AND active = 1',
  //     [userId],
  //     (userError, userResults) => {
  //       if (userError) {
  //         return res.status(500).json({ message: 'Internal server error.' });
  //       }

  //       if (userResults.length === 0) {
  //         return res
  //           .status(404)
  //           .json({ message: 'User not found or not active.' });
  //       }

  //       // User exists and is active, proceed to retrieve contributions
  //       db.query(
  //         'SELECT * FROM Contributions WHERE userID = ?',
  //         [userId],
  //         (contribError, contribResults) => {
  //           if (contribError) {
  //             return res
  //               .status(500)
  //               .json({ message: 'Failed to retrieve contributions.' });
  //           }

  //           // Return the contributions as JSON response
  //           return res.json({ contributions: contribResults });
  //         },
  //       );
  //     },
  //   );
  // }

  // createContribution(req, res) {
  //   const { userId } = req.session;
  //   const data = req.body;

  //   // Check if the user exists and is active
  //   db.query(
  //     'SELECT * FROM User WHERE userID = ? AND active = 1',
  //     [userId],
  //     (userError, userResults) => {
  //       if (userError) {
  //         return res.status(500).json({ message: 'Internal server error.' });
  //       }

  //       if (userResults.length === 0) {
  //         return res
  //           .status(404)
  //           .json({ message: 'User not found or not active.' });
  //       }

  //       const registrationDate = new Date(); // Get the current date and time
  //       const scoringMultiplier = 0.1;
  //       const scoreContr = data.quantity * scoringMultiplier;

  //       // Check if the 'data' object is defined and has the expected properties
  //       if (data) {
  //         // Insert the contribution data into the database
  //         db.query(
  //           'INSERT INTO Contributions (userId, contributionType, description, location, date, quantity, units, additionalDetails, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  //           [
  //             userId,
  //             data.contributionType,
  //             data.description,
  //             data.location,
  //             data.date,
  //             data.quantity,
  //             data.units,
  //             data.additionalDetails,
  //             registrationDate,
  //             registrationDate,
  //           ],
  //           (insertError) => {
  //             if (insertError) {
  //               return res
  //                 .status(500)
  //                 .json({ message: 'Contribution creation failed.' });
  //             }
  //             scoreRepository.updateOrInsertContributionsScore(
  //               userId,
  //               scoreContr,
  //             );
  //             // You may perform additional actions or validations here

  //             // Send the response only after the database query has been executed
  //             return res.json({
  //               message: 'Contribution created successfully.',
  //             });
  //           },
  //         );
  //       } else {
  //         return res
  //           .status(400)
  //           .json({ message: 'Invalid contribution data.' });
  //       }
  //     },
  //   );
  // }

  // getReceivedMessages(req, res) {
  //   const { userId } = req.session;

  //   // Check if the user exists and is active
  //   db.query(
  //     'SELECT * FROM User WHERE userID = ? AND active = 1',
  //     [userId],
  //     (userError, userResults) => {
  //       if (userError) {
  //         return res.status(500).json({ message: 'Internal server error.' });
  //       }

  //       if (userResults.length === 0) {
  //         return res
  //           .status(404)
  //           .json({ message: 'User not found or not active.' });
  //       }

  //       // User exists and is active, proceed to retrieve received messages
  //       db.query(
  //         'SELECT received_messages FROM User WHERE userID = ?',
  //         [userId],
  //         (getError, getResults) => {
  //           if (getError) {
  //             return res
  //               .status(500)
  //               .json({ message: 'Failed to retrieve received messages.' });
  //           }

  //           // Check if received_messages is not undefined or null
  //           if (getResults[0].received_messages) {
  //             try {
  //               // Attempt to parse the received_messages as JSON
  //               const receivedMessages = JSON.parse(
  //                 getResults[0].received_messages,
  //               );

  //               // Check if the parsed data is an array
  //               if (Array.isArray(receivedMessages)) {
  //                 // Modify the structure to include source user information
  //                 const messagesWithSource = receivedMessages.map(
  //                   (message) => ({
  //                     from: userResults[0].username, // Assuming 'username' is a unique identifier for users
  //                     message,
  //                   }),
  //                 );

  //                 return res.json({ receivedMessages: messagesWithSource });
  //               } else {
  //                 console.error(
  //                   'Invalid received_messages data structure:',
  //                   receivedMessages,
  //                 );
  //                 return res.status(500).json({
  //                   message: 'Invalid received_messages data structure.',
  //                 });
  //               }
  //             } catch (jsonParseError) {
  //               console.error(
  //                 'Error parsing received_messages:',
  //                 jsonParseError,
  //               );
  //               return res
  //                 .status(500)
  //                 .json({ message: 'Error parsing received messages.' });
  //             }
  //           } else {
  //             return res.json({ receivedMessages: [] });
  //           }
  //         },
  //       );
  //     },
  //   );
  // }

  // getSentMessages(req, res) {
  //   const { userId } = req.session;

  //   // Check if the user exists and is active
  //   db.query(
  //     'SELECT * FROM User WHERE userID = ? AND active = 1',
  //     [userId],
  //     (userError, userResults) => {
  //       if (userError) {
  //         return res.status(500).json({ message: 'Internal server error.' });
  //       }

  //       if (userResults.length === 0) {
  //         return res
  //           .status(404)
  //           .json({ message: 'User not found or not active.' });
  //       }

  //       // User exists and is active, proceed to retrieve contributions
  //       db.query(
  //         'SELECT sent_messages FROM User WHERE userID = ?',
  //         [userId],
  //         (getError, getResults) => {
  //           if (getError) {
  //             return res
  //               .status(500)
  //               .json({ message: 'Failed to retrieve contributions.' });
  //           }

  //           // Return the contributions as JSON response
  //           return res.json({ sentMessages: getResults });
  //         },
  //       );
  //     },
  //   );
  // }

  // sendMessage(req, res) {
  //   const { userId } = req.session;
  //   const data = req.body;

  //   // Check if the user exists and is active
  //   db.query(
  //     'SELECT * FROM User WHERE userID = ? AND active = 1',
  //     [userId],
  //     (userError, userResults) => {
  //       if (userError) {
  //         console.error('Error:', userError);
  //         return res.status(500).json({ message: 'Internal server error.' });
  //       }

  //       if (userResults.length === 0) {
  //         return res
  //           .status(404)
  //           .json({ message: 'User not found or not active.' });
  //       }

  //       // Check if the 'data' object is defined and has the expected properties
  //       if (!(data && data.to && data.content)) {
  //         return res.status(400).json({ message: 'Invalid message data.' });
  //       }

  //       // Check if the recipient user exists
  //       db.query(
  //         'SELECT * FROM User WHERE username = ?',
  //         [data.to],
  //         (recipientError, recipientResults) => {
  //           if (recipientError) {
  //             console.error('Error:', recipientError);
  //             return res
  //               .status(500)
  //               .json({ message: 'Internal server error.' });
  //           }

  //           if (recipientResults.length === 0) {
  //             return res
  //               .status(404)
  //               .json({ message: 'Recipient user not found.' });
  //           }

  //           const sentDate = new Date(); // Get the current date and time

  //           // Retrieve recipient user's existing sent messages
  //           const existingSentMessages =
  //             recipientResults[0].sent_messages || '[]';
  //           const existingReceivedMessages =
  //             recipientResults[0].received_messages || '[]';

  //           // Parse the existing sent messages or initialize as an empty array
  //           const parsedExistingSentMessages = JSON.parse(existingSentMessages);
  //           const parsedExistingReceivedMessages = JSON.parse(
  //             existingReceivedMessages,
  //           );

  //           // Create a new message object with sender's username
  //           const newMessage = {
  //             to: data.to, // receiver's username
  //             content: data.content,
  //             sentDate: sentDate.toISOString(),
  //           };
  //           const newMessage1 = {
  //             from: userResults[0].username, // Sender's username
  //             content: data.content,
  //             sentDate: sentDate.toISOString(),
  //           };

  //           // Update the recipient user's sent_messages array
  //           parsedExistingSentMessages.push(newMessage);
  //           parsedExistingReceivedMessages.push(newMessage1);

  //           // Update the recipient user's record in the database with the new sent_messages array
  //           db.query(
  //             'UPDATE User SET sent_messages = ? WHERE username = ?',
  //             [
  //               JSON.stringify(parsedExistingSentMessages),
  //               userResults[0].username,
  //             ],
  //             (updateError1) => {
  //               if (updateError1) {
  //                 console.error('Error:', updateError1);
  //                 return res
  //                   .status(500)
  //                   .json({ message: 'Message sending failed.' });
  //               }

  //               // Update the sender user's record in the database with the new received_messages array
  //               db.query(
  //                 'UPDATE User SET received_messages = ? WHERE username = ?',
  //                 [JSON.stringify(parsedExistingReceivedMessages), data.to],
  //                 (updateError2) => {
  //                   if (updateError2) {
  //                     console.error('Error:', updateError2);
  //                     return res
  //                       .status(500)
  //                       .json({ message: 'Message sending failed.' });
  //                   }

  //                   // Send the response only after the database queries have been executed
  //                   return res.json({ message: 'Message sent successfully.' });
  //                 },
  //               );
  //             },
  //           );
  //         },
  //       );

  //       // User exists and is active, proceed to retrieve contributions
  //       db.query(
  //         'SELECT * FROM Contributions WHERE userID = ?',
  //         [userId],
  //         (contribError, contribResults) => {
  //           if (contribError) {
  //             return res
  //               .status(500)
  //               .json({ message: 'Failed to retrieve contributions.' });
  //           }

  //           // Return the contributions as JSON response
  //           return res.json({ contributions: contribResults });
  //         },
  //       );
  //     },
  //   );
  // }

  // getReceivedMessages(req, res) {
  //   const { userId } = req.session;

  //   // Check if the user exists and is active
  //   db.query(
  //     'SELECT * FROM User WHERE userID = ? AND active = 1',
  //     [userId],
  //     (userError, userResults) => {
  //       if (userError) {
  //         return res.status(500).json({ message: 'Internal server error.' });
  //       }

  //       if (userResults.length === 0) {
  //         return res
  //           .status(404)
  //           .json({ message: 'User not found or not active.' });
  //       }

  //       // User exists and is active, proceed to retrieve received messages
  //       db.query(
  //         'SELECT received_messages FROM User WHERE userID = ?',
  //         [userId],
  //         (getError, getResults) => {
  //           if (getError) {
  //             return res
  //               .status(500)
  //               .json({ message: 'Failed to retrieve received messages.' });
  //           }

  //           // Check if received_messages is not undefined or null
  //           if (getResults[0].received_messages) {
  //             try {
  //               // Attempt to parse the received_messages as JSON
  //               const receivedMessages = getResults[0].received_messages;

  //               // Check if the parsed data is an array
  //               if (Array.isArray(receivedMessages)) {
  //                 // Modify the structure to include source user information
  //                 const messagesWithSource = receivedMessages.map(
  //                   (message) => ({
  //                     from: userResults[0].username, // Assuming 'username' is a unique identifier for users
  //                     message,
  //                   }),
  //                 );

  //                 return res.json({ receivedMessages: messagesWithSource });
  //               } else {
  //                 console.error(
  //                   'Invalid received_messages data structure:',
  //                   receivedMessages,
  //                 );
  //                 return res.status(500).json({
  //                   message: 'Invalid received_messages data structure.',
  //                 });
  //               }
  //             } catch (jsonParseError) {
  //               console.error(
  //                 'Error parsing received_messages:',
  //                 jsonParseError,
  //               );
  //               return res
  //                 .status(500)
  //                 .json({ message: 'Error parsing received messages.' });
  //             }
  //           } else {
  //             return res.json({ receivedMessages: [] });
  //           }
  //         },
  //       );
  //     },
  //   );
  // }

  // getSentMessages(req, res) {
  //   const { userId } = req.session;

  //   // Check if the user exists and is active
  //   db.query(
  //     'SELECT * FROM User WHERE userID = ? AND active = 1',
  //     [userId],
  //     (userError, userResults) => {
  //       if (userError) {
  //         return res.status(500).json({ message: 'Internal server error.' });
  //       }

  //       if (userResults.length === 0) {
  //         return res
  //           .status(404)
  //           .json({ message: 'User not found or not active.' });
  //       }

  //       // User exists and is active, proceed to retrieve contributions
  //       db.query(
  //         'SELECT sent_messages FROM User WHERE userID = ?',
  //         [userId],
  //         (getError, getResults) => {
  //           if (getError) {
  //             return res
  //               .status(500)
  //               .json({ message: 'Failed to retrieve contributions.' });
  //           }

  //           // Return the contributions as JSON response
  //           return res.json({ sentMessages: getResults });
  //         },
  //       );
  //     },
  //   );
  // }

  // sendMessage(req, res) {
  //   const { userId } = req.session;
  //   const data = req.body;

  //   // Function to execute a database query
  //   const queryDatabase = (sql, params) => {
  //     return new Promise((resolve, reject) => {
  //       db.query(sql, params, (error, results) => {
  //         if (error) {
  //           console.error('Error:', error);
  //           reject(error);
  //         } else {
  //           resolve(results);
  //         }
  //       });
  //     });
  //   };

  //   let userResults;
  //   let parsedExistingReceivedMessages; // Declare it at a higher scope

  //   // Check if the user exists and is active
  //   queryDatabase('SELECT * FROM User WHERE userID = ? AND active = 1', [
  //     userId,
  //   ])
  //     .then((results) => {
  //       userResults = results;
  //       if (userResults.length === 0) {
  //         throw { status: 404, message: 'User not found or not active.' };
  //       }

  //       if (!(data && data.to && data.content)) {
  //         throw { status: 400, message: 'Invalid message data.' };
  //       }

  //       // Check if the recipient user exists
  //       return queryDatabase('SELECT * FROM User WHERE username = ?', [
  //         data.to,
  //       ]);
  //     })
  //     .then((recipientResults) => {
  //       if (recipientResults.length === 0) {
  //         throw { status: 404, message: 'Recipient user not found.' };
  //       }

  //       const sentDate = new Date();

  //       const existingSentMessages = recipientResults[0].sent_messages || '[]';
  //       const existingReceivedMessages =
  //         recipientResults[0].received_messages || '[]';

  //       const parsedExistingSentMessages = existingSentMessages;
  //       parsedExistingReceivedMessages = existingReceivedMessages;

  //       console.log(userResults[0].Username);
  //       console.log(userResults);

  //       const newMessage = {
  //         to: data.to,
  //         content: data.content,
  //         sentDate: sentDate.toISOString(),
  //       };
  //       const newMessage1 = {
  //         from: userResults[0].Username,
  //         content: data.content,
  //         sentDate: sentDate.toISOString(),
  //         senderInfo: {
  //           Username: userResults[0].Username,
  //         },
  //       };

  //       parsedExistingSentMessages.push(newMessage);
  //       parsedExistingReceivedMessages.push(newMessage1);

  //       // Update the recipient user's record in the database with the new sent_messages array
  //       return queryDatabase(
  //         'UPDATE User SET sent_messages = ? WHERE userID = ?',
  //         [JSON.stringify(parsedExistingSentMessages), userId],
  //       );
  //     })
  //     .then(() => {
  //       // Update the sender user's record in the database with the new received_messages array
  //       return queryDatabase(
  //         'UPDATE User SET received_messages = ? WHERE username = ?',
  //         [JSON.stringify(parsedExistingReceivedMessages), data.to],
  //       );
  //     })
  //     .then(() => {
  //       // Fetch the updated sent_messages array for the sender
  //       return queryDatabase(
  //         'SELECT sent_messages FROM User WHERE userID = ?',
  //         [userId],
  //       );
  //     })
  //     .then((senderRecord) => {
  //       console.log(
  //         'Sender Sent Messages after update:',
  //         senderRecord[0].sent_messages,
  //       );

  //       // Send the response only after the database queries have been executed
  //       res.status(200).json({
  //         message: 'Message sent successfully.',
  //         // Omit the sentMessages field if you don't want to return the list of sent messages
  //       });
  //     })
  //     .catch((error) => {
  //       const status = error.status || 500;
  //       console.error('Error during message sending:', error);
  //       res.status(status).json({ message: error.message });
  //     });
  // }

  // getUserInterests(userId) {
  //   return new Promise((resolve, reject) => {
  //     // Check if the user exists and is active
  //     db.query(
  //       'SELECT interests FROM User WHERE userID = ? AND active = 1',
  //       [userId],
  //       (error, results) => {
  //         if (error) {
  //           console.error('Error fetching user interests:', error);
  //           return reject('Internal server error.');
  //         }

  //         if (results.length === 0) {
  //           return resolve([]); // User not found or has no interests
  //         }

  //         try {
  //           // Parse the JSON data and handle potential errors
  //           const parsedInterests = results[0].interests;
  //           return resolve(parsedInterests);
  //         } catch (parseError) {
  //           console.error('Error parsing user interests:', parseError);
  //           return reject('Error parsing user interests.');
  //         }
  //       },
  //     );
  //   });
  // }

  // addInterests(userId, interests) {
  //   return new Promise((resolve, reject) => {
  //     // Fetch existing interests from the database
  //     this.getUserInterests(userId)
  //       .then((existingInterests) => {
  //         try {
  //           // Assuming existing interests is an array stored in the JSON field
  //           const combinedInterests = [...existingInterests, interests];

  //           // Update the user's interests in the database
  //           db.query(
  //             'UPDATE User SET interests = ? WHERE userID = ? and Active = 1',
  //             [JSON.stringify(combinedInterests), userId],
  //             (updateError) => {
  //               if (updateError) {
  //                 console.error('Error updating user interests:', updateError);
  //                 reject('Error updating user interests.');
  //               } else {
  //                 resolve('Interests added successfully.');
  //               }
  //             },
  //           );
  //         } catch (parseError) {
  //           console.error('Error combining user interests:', parseError);
  //           reject('Error combining user interests.');
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching existing interests:', error);
  //         reject('Error fetching existing interests.');
  //       });
  //   });
  // }

  // // for middlewares
  // getUserType(userId) {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       'SELECT userType FROM User WHERE userId = ?',
  //       [userId],
  //       (error, results) => {
  //         if (error) {
  //           reject('Error fetching user type from the database.');
  //         } else {
  //           const userType = results[0]?.userType;
  //           resolve(userType);
  //         }
  //       },
  //     );
  //   });
  // }
