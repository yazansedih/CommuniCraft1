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
    const { id } = req.params; 
    
    const sql = 'SELECT * FROM localpartnerships WHERE WorkshopID = ?';
    db.query(sql, [id], (error, results) => {
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
    const { ownerId } = req.session;
    const { id } = req.params; 
    const { Workshopname, Location, Description, ContactInfo, cost } = req.body.workshop;

    // Check if the user exists
    db.query(
      'SELECT * FROM localpartnerships WHERE WorkshopID = ?',
      [id],
      (error, results) => { 
        if (error) { 
          return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: 'Workshop not found.' });
        }

        // Prepare an update query based on the fields the user wants to update
        const updateFields = [];
        const updateValues = [];

        if (Workshopname) {
          updateFields.push('WorkshopName = ?');
          updateValues.push(Workshopname);
        }
        if (Location) {
            updateFields.push('Location = ?');
            updateValues.push(Location);          
        }
        if (Description) {
          updateFields.push('Description = ?');
          updateValues.push(Description);
        }

        // if (ContactInfo && Array.isArray(ContactInfo)) {
        //   const ContactInfoJSON = JSON.stringify(ContactInfo);

        //   updateFields.push('ContactInfo = ?');
        //   updateValues.push(ContactInfoJSON);
        // }
        if (ContactInfo) {
          updateFields.push('ContactInfo = ?');
          updateValues.push(ContactInfo);
        }

        if (cost) {
          updateFields.push(`Cost = ?`);
          updateValues.push(cost);
        }
        
        if (updateFields.length === 0) {
          return res
            .status(400)
            .json({ message: 'No valid fields to update.' });
        }
        
        // Construct the parameterized update query
        const updateQuery = `UPDATE localpartnerships SET ${updateFields.join(', ')} WHERE WorkshopID = ?`;
        
        // Combine the values for the query
        const queryValues = [...updateValues, id];
      
        // Execute the parameterized query
        db.query(updateQuery, queryValues, (updateError) => {
          if (updateError) {
            return res.status(500).json({ message: 'Workshop update failed.' });
          }
      
          return res.status(200).json({ message: 'Workshop updated successfully.' });
        });

      },
    );
  }
  
  deleteWorkshop(req, res) {
    const { id } = req.params;
    const WorkshopID = parseInt(id); 

    const sql = 'DELETE FROM localpartnerships WHERE WorkshopID = ?';
    db.query(sql, [WorkshopID], (error, results) => {
    if (error) {
        console.error('Error deleting workshop:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Workshop not found' });
    }

    res.status(200).json({ message: 'Workshop deleted successfully', WorkshopID: WorkshopID });
    });
  }
  
  searchAllGroups(req, res) {
    const sql = 'SELECT * FROM `group` WHERE Status = 1';

    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error searching for groups:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ groups: results });
    });
  }

  searchGroup(req, res) {
    const { id } = req.params;

    const sql = 'SELECT * FROM `group` WHERE GroupID = ?';
    db.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Error searching for group:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }
        
        res.status(200).json({ group: results[0] });
    });
  }

  async groupEmployment(req, res) {
    const { workshopid } = req.params;
    var { groupid } = req.params;

    try {
        const [results] = await db.promise().query('SELECT * FROM `group` WHERE GroupID = ? AND Status = 1', [groupid]);

        if (results.length === 0) {
            groupid = null;
            return res.status(404).json({ error: 'Group not found or already booked!😯' });
        }

        // If the group exists and is available, proceed with the update
        if (groupid !== null) {
            const updateQuery = `UPDATE localpartnerships SET GroupID = ? WHERE WorkshopID = ?`;
            const queryValues = [groupid, workshopid];

            db.query(updateQuery, queryValues, (updateError) => {
                if (updateError) {
                    return res.status(500).json({ message: 'Group Employment failed.' });
                }

                const uQuery = `UPDATE \`group\` SET Status = ? WHERE GroupID = ?`;
                const Values = ['0', groupid];
                db.query(uQuery, Values, (updateError) => {
                    if (updateError) {
                        console.log(updateError);
                        return res.status(500).json({ message: 'Update Group Status failed.' });
                    }

                    return res.json({ message: 'Group Employment successfully.' });
                });
            });
        }
    } catch (error) {
        console.error('Error employment for group:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
  }

  layingOffGroup(req, res) {
    const { workshopid } = req.params;
    let groupid = null;

    const sql = 'SELECT * FROM localpartnerships WHERE WorkshopID = ?';
    db.query(sql, [workshopid], (error, results) => {
        if (error) {
            console.error('Error workshop for WorkshopID:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length !== 0) {
            groupid = results[0].GroupID;
        }

        if(groupid !== null){
          const updateQuery = `UPDATE localpartnerships SET GroupID = ? WHERE WorkshopID = ?`;
          const queryValues = [null, workshopid];
  
          db.query(updateQuery, queryValues, (updateError) => {
              if (updateError) {
                  return res.status(500).json({ message: 'Group Laying Off failed.' });
              }
  
              const uQuery = `UPDATE \`group\` SET Status = ? WHERE GroupID = ?`;
              const Values = ['1', groupid];
              db.query(uQuery, Values, (updateError) => {
                  if (updateError) {
                      console.log(updateError);
                      return res.status(500).json({ message: 'Group Status failed.' });
                  }
  
                  return res.json({ message: 'Group Laying Off successfully.' });
              });
          });
        } else {
          return res.status(404).json({ message: 'Workshop not have group!😢' });
        }
        
    });
  }

}

module.exports = LocalpartnershipRepository;