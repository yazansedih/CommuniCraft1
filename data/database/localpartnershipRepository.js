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
  

}

module.exports = LocalpartnershipRepository;