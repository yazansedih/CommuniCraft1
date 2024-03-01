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

class ResourcesRepository {
  addResource(req, res) {
    const { UserID, ResourceName, Quantity, Cost, Availability, ImageURL } = req.body;

    
    const checkUserSql = 'SELECT UserID FROM users WHERE UserID = ?';
    db.query(checkUserSql, [UserID], (userError, userResults) => {
        if (userError) {
            console.error('Error checking user existence:', userError);
            return res.status(500).json({ error: 'Internal server error' });
        }

       
        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

       
        const sql = 'INSERT INTO resource (UserID, ResourceName, Quantity, Cost, Availability, ImageURL) VALUES (?, ?, ?, ?, ?, ?)';

       
        db.query(sql, [UserID, ResourceName, Quantity, Cost, Availability, ImageURL], (error, results) => {
            if (error) {
                console.error('Error inserting resource:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }

            
            res.status(201).json({ message: 'Resource added successfully', resourceId: results.insertId });
        });
    });
}
updateResource(req, res) {
 
  const { id } = req.params;
  const { UserID, ResourceName, Quantity, Cost, Availability, ImageURL } = req.body;

  
  const sql = `UPDATE resource 
               SET UserID = ?, 
                   ResourceName = ?, 
                   Quantity = ?, 
                   Cost = ?, 
                   Availability = ?, 
                   ImageURL = ? 
               WHERE ResourceID = ?`;

  
  db.query(sql, [UserID, ResourceName, Quantity, Cost, Availability, ImageURL, id], (error, results) => {
      if (error) {
          console.error('Error updating resource:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Resource not found' });
      }

      
      res.status(200).json({ message: 'Resource updated successfully', resourceId: id });
  });
}
deleteResource(req,res){
res.send("ok");
}
printAll(req, res) {
  
  const sql = 'SELECT * FROM resource';

  
  db.query(sql, (error, results) => {
      if (error) {
          console.error('Error fetching resources:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }

      
      res.status(200).json({ resources: results });
  });
}
availableResource(req, res) {
    
    const sql = 'SELECT * FROM resource WHERE Availability = 1';

  
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching available resources:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

       
        res.status(200).json({ availableResources: results });
    });
}
ResourceMaxcoast(req, res) {
    const { maxcoast } = req.params;

   
    const sql = 'SELECT * FROM resource WHERE Cost <= ?';

    db.query(sql, [maxcoast], (error, results) => {
        if (error) {
            console.error('Error fetching resources by maximum cost:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        
        res.status(200).json({ resources: results });
    });
}





}

module.exports = ResourcesRepository;