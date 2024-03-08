const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'advdatabase',
});

class CompaniesRepository {

  loginCompany(req, res) {
    
    const { username, password } = req.body;
    // Find the company by username
    db.query(
      'SELECT * FROM companies WHERE Username = ?',
      [username],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid data.' });
        }

        const company = results[0];

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(
          password,
          company.Password,
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
              'UPDATE companies SET LastLoginDate = CURRENT_TIMESTAMP WHERE CompanyID = ?',
              [company.CompanyID],
              (updateError) => {
                if (updateError) {
                  return res
                    .status(500)
                    .json({ message: 'Internal server error.' });
                }
                
                // return res.json({ message: 'Login successful.' });
              },
            );

            req.session.companyId = company.CompanyID;
            req.session.type = "company"; 
            return res.status(200).json({ message: 'Company login successfully.' });
          },
        );
      },
    );
  };

  logoutCompany(req, res) {
    const { companyId } = req.session;

    db.query(
      'SELECT * FROM companies WHERE CompanyID = ?',
      [companyId],
      (searchError, results) => {
        if (searchError) {
          res.status(500).json({ message: 'Error logging out.' });
        } else if (results.length === 0) {
          res.status(500).json({ message: 'Error logging out.' });
        } else {
          // Company is active, destroy the session
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

  getCompanyProfile(req, res) {
    const { companyId } = req.session;

    db.query(
        'SELECT * FROM companies WHERE CompanyID = ?',
        [companyId],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Internal server error.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Company not found.' });
            }

            const companyProfile = results[0];
            return res.json({ user: companyProfile });
        },
    );
  }

  updateCompanyProfile(req, res) {
    const { companyId } = req.session;
    const { Username, Password, Email, CompanyName, Specialty, Location , Employees, Description } = req.body.company;

    // Check if the user exists
    db.query(
      'SELECT * FROM companies WHERE CompanyID = ?',
      [companyId],
      (error, results) => { 
        if (error) { 
          return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: 'Company not found.' });
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
        if (CompanyName) {
          updateFields.push(`CompanyName = ?`);
          updateValues.push(CompanyName);
        }
        if (Specialty) {
          updateFields.push(`Specialty = ?`);
          updateValues.push(Specialty);
        }
        if (Location) {
          updateFields.push(`Location = ?`);
          updateValues.push(Location);
        }
        if (Employees) {
          updateFields.push(`Employees = ?`);
          updateValues.push(Employees);
        }
        if (Description) {
          updateFields.push(`Description = ?`);
          updateValues.push(Description);
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
            const updateQuery = `UPDATE companies SET Password = ? WHERE CompanyID = ?`;
        
            // Combine the values for the query
            const queryValues = [hashedPassword, companyId];
        
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
          const updateQuery = `UPDATE companies SET ${updateFields.join(', ')} WHERE CompanyID = ?`;
        
          // Combine the values for the query
          const queryValues = [...updateValues, companyId];
          
          // Execute the parameterized query
          db.query(updateQuery, queryValues, (updateError) => {
            if (updateError) {
              return res.status(500).json({ message: 'Company profile update failed.' });
            }
        
            return res.json({ message: 'Company profile updated successfully.' });
          });
        }
             
      },
    );
  }

  deleteCompany(req, res) {
    const { companyId } = req.session;

    db.query(
      'SELECT * FROM companies WHERE CompanyID = ?',
      [companyId],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'Company not found.' });
        }

        // Delete
        db.query(
          'DELETE FROM companies WHERE CompanyID = ?',
          [companyId],
          (deleteError, deleteResults) => {
              if (deleteError) {
                  return res.status(500).json({ message: 'Company deletion failed!' });
              }
      
              // Check if any rows were affected by the delete operation
              if (deleteResults.affectedRows === 0) {
                  return res.status(404).json({ message: 'Company not found!' });
              }
              
              req.session.destroy((destroyError) => {
                  if (destroyError) {
                      return res.status(500).json({ message: 'Error destroying session.' });
                  }
      
                  return res.json({ message: 'Company deleted successfully.' });
              });
          }
      );
      
      },
    );
  }  

  searchAllWorkshops(req, res){
    const sql = 'SELECT * FROM localpartnerships';

    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error searching for workshops:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ workshops: results });
    });
  }

  searchWorkshop(req, res) {
    const { workshopid } = req.params;

    const sql = 'SELECT * FROM localpartnerships WHERE WorkshopID = ?';
    db.query(sql, [workshopid], (error, results) => {
        if (error) {
            console.error('Error searching for Workshop:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Workshop not found' });
        }
        
        res.status(200).json({ workshop: results[0] });
    });
  }

  searchWorkshopiSupport(req,res){
    const { companyId } = req.session;

    const sql = 'SELECT * FROM collaboration WHERE CompanyID = ?';
    db.query(sql, [companyId], (error, results) => {
        if (error) {
            console.error('Error searching for Workshop:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Workshop that you support not found!' });
        }
        
        res.status(200).json({ workshop: results });
    });
  }

  provideSupportWorkshop(req, res) {
    const { companyId } = req.session;
    const { workshopid } = req.params;
    const { description } = req.body;
    
    db.query(
      'SELECT * FROM localpartnerships WHERE WorkshopID = ?',
      [workshopid],
      (error, results) => {
        if (error) {
          console.error('Error checking workshop:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
    
        if (results.length === 0) {
          return res.status(404).json({ error: 'Workshop not found' });
        }
        
        const sql = 'SELECT * FROM collaboration WHERE CompanyID = ? AND WorkshopID = ?';
        db.query(sql, [companyId, workshopid], (error, results) => {
          if (error) {
            console.error('Error Workshop supporting:', error);
            return res.status(500).json({ error: 'Internal server error' });
          }

          if (results.length !== 0) {
            return res.status(404).json({ error: 'Collaboration already existing!😊'});        
          }
          else {
            const date = new Date();
            const sql = 'INSERT INTO collaboration (CompanyID, WorkshopID, Description, RegistrationDate, Status) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [companyId, workshopid, description, date, '0'], (error, results) => {
                if (error) {
                    console.error('Error make collaboration:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.status(201).json({ message: 'Collaboration successfully.😊', collaborationID: results.insertId });
            });
          }
        });
      }
    );
  }

  cancelSupportWorkshop(req, res) {
    const { companyId } = req.session;
    const { workshopid } = req.params;

    const sql = 'DELETE FROM collaboration WHERE CompanyID = ? AND WorkshopID = ?';
      db.query(sql, [companyId, workshopid], (error, results) => {
        if (error) {
          console.error('Error Workshop supporting:', error);
          return res.status(500).json({ error: 'Collaboration deletion failed!' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'Collaboration not found!'});        
        }                    

        req.session.destroy((destroyError) => {
          if (destroyError) {
              return res.status(500).json({ message: 'Error destroying session.' });
          }

          return res.json({ message: 'Collaboration deletion successfully!😊' });
        });
      });
  }

  sendMessage(req,res) {
    const { companyId } = req.session;
    const { to, message } = req.body;  // to : workshopid

    if (!(to && message)) {
      return res.status(400).json({ message: "Invalid message data." });
    }

    // console.log("comanyID:", companyId, " workshopid:", to);
    db.query(
      "SELECT * FROM collaboration WHERE CompanyID = ? AND WorkshopID = ?",
      [companyId, to],
      (userError, userResults) => {
        if (userError) {
          console.error("Error:", userError);
          return res.status(500).json({ message: "Internal server error." });
        }

        if (userResults.length === 0) {
          return res
            .status(404)
            .json({
              message: "Collaboration does not exist!😢",
            });
        }

        const registrationDate = new Date();
        db.query(
          "INSERT INTO communication (SenderID, ReceiverID, Message, SenderType, ReceiverType, Timestamp) VALUES (?, ?, ?, ?, ?, ?)",
          [companyId, to, message, 'company', 'workshop', registrationDate],
          (insertError) => {
            if (insertError) {
              return res.status(400).json({ message: "Communication failed😢!" });
            }

            return res.status(200).json({ message: "Communication successfully😊." });
          }
        );
      }
    );
  }

  receivedMessages(req,res) {
    const { companyId } = req.session;

    db.query(
      "SELECT * FROM communication WHERE ReceiverID = ? AND ReceiverType = ?",
      [companyId, 'company'],
      (insertError, resss) => {
        if (insertError) {
          console.log("Error:", insertError);
          return res.status(400).json({ message: "Communication failed😢!" });
        }

        return res.status(200).json({ receivedMessages: resss });
      }
    ); 
    
  }

  sentMessages(req,res) {
    const { companyId } = req.session;

    db.query(
      "SELECT * FROM communication WHERE SenderID = ? AND SenderType = ?",
      [companyId, 'company'],
      (insertError, resss) => {
        if (insertError) {
          console.log("Error:", insertError);
          return res.status(400).json({ message: "Communication failed😢!" });
        }

        return res.status(200).json({ sentMessages: resss });
      }
    ); 
    
  }

  deleteMessage(req,res) {
    const { companyId } = req.session;
    const { messageid } = req.params;

    db.query(
      "DELETE FROM communication WHERE MessageID = ? AND (SenderID = ? OR ReceiverID = ?) AND (SenderType = 'company' OR ReceiverType = 'company')",
      [messageid, companyId, companyId],
      (insertError, results) => {
        if (insertError) {
          return res.status(400).json({ message: "Communication not found!😢" });
        }
        
        return res.json({ message: 'Delete message successfully.😊' });
      }
    ); 
    
  }

  deleteMessageHistory(req,res) {
    const { companyId } = req.session;

    db.query(
      "DELETE FROM communication WHERE (SenderID = ? OR ReceiverID = ?) AND (SenderType = 'company' OR ReceiverType = 'company')",
      [companyId, companyId],
      (insertError, results) => {
        if (insertError) {
          return res.status(400).json({ message: "Communication not found!😢" });
        }
        
        return res.json({ message: 'Delete message successfully.😊' });
      }
    );    
    
  }
}

module.exports = CompaniesRepository;