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
        const { ResourceName, Description, Quantity, Cost, Availability, ImageURL } = req.body;
        const UserID = req.session.userId;
    
        // SQL query to insert resource into the database
        const sql = 'INSERT INTO resource (userid, ResourceName, Description, Quantity, Cost, Availability, ImageURL) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
        // Execute the SQL query
        db.query(sql, [UserID, ResourceName, Description, Quantity, Cost, Availability, ImageURL], (error, results) => {
            if (error) {
                console.error('Error inserting resource:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            // Send response indicating successful insertion of the resource
            res.status(201).json({ message: 'Resource added successfully', resourceId: results.insertId });
        });
    }
    
    updateResource(req, res) {
        const { id } = req.params;
        const { ResourceName, Quantity, Cost, Availability, ImageURL, Description } = req.body;
        const UserID = req.session.userId; // Get UserID from session
    
        // Check if the resource ID exists in the database
        db.query('SELECT UserID FROM resource WHERE ResourceID = ?', [id], (error, rows) => {
            if (error) {
                console.error('Error checking resource ID:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            // Check if the resource ID does not exist in the database
            if (rows.length === 0) {
                // The resource ID provided is not valid
                return res.status(404).json({ error: 'Invalid resource ID' });
            }
    
            // Check if the resource exists and belongs to the authenticated user
            if (rows[0].UserID !== UserID) {
                // The resource exists but the user is not authorized to update it
                return res.status(403).json({ error: "You're not authorized to update this resource" });
            }
    
            // SQL query to update resource in the database, considering UserID and ResourceID
            const sql = `UPDATE resource 
                        SET ResourceName = ?, 
                            Quantity = ?, 
                            Cost = ?, 
                            Availability = ?, 
                            ImageURL = ?, 
                            Description = ?
                        WHERE ResourceID = ? AND UserID = ?`; // Add Description to SET and UserID condition
    
            // Execute the SQL query
            db.query(sql, [ResourceName, Quantity, Cost, Availability, ImageURL, Description, id, UserID], (error, results) => {
                if (error) {
                    console.error('Error updating resource:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }
    
                // Check if the resource was updated
                if (results.affectedRows === 0) {
                    // The resource was not updated
                    return res.status(500).json({ error: 'Failed to update resource' });
                }
    
                // Send response indicating successful update of the resource
                res.status(200).json({ message: 'Resource updated successfully', resourceId: id });
            });
        });
    }
    
    
    
    
    deleteResource(req, res) {
        const { id } = req.params;
        const UserID = req.session.userId;
    
        // Check if the resource ID exists in the database and belongs to the authenticated user
        db.query('SELECT UserID FROM resource WHERE ResourceID = ?', [id], (error, rows) => {
            if (error) {
                console.error('Error checking resource ID:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            // Check if the resource ID does not exist in the database
            if (rows.length === 0) {
                // The resource ID provided is not valid
                return res.status(404).json({ error: 'Resource not found' });
            }
    
            // Check if the resource exists and belongs to the authenticated user
            if (rows[0].UserID !== UserID) {
                // The resource exists but the user is not authorized to delete it
                return res.status(403).json({ error: "You're not authorized to delete this resource" });
            }
    
            // If the resource exists and belongs to the authenticated user, proceed with deletion
            const sql = 'DELETE FROM resource WHERE ResourceID = ? AND UserID = ?';
    
            db.query(sql, [id, UserID], (error, results) => {
                if (error) {
                    console.error('Error deleting resource:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }
    
                if (results.affectedRows === 0) {
                    return res.status(500).json({ error: 'Failed to delete resource' });
                }
    
                // Send a success response if the resource was deleted successfully
                res.status(200).json({ message: 'Resource deleted successfully', resourceId: id });
            });
        });
    }
    
printAll(req, res) {
    const sql = `
        SELECT r.ResourceID, r.ResourceName, r.Description, r.Quantity, r.Cost, r.Availability, r.ImageURL, u.Username, u.Email
        FROM resource r
        INNER JOIN users u ON r.userid = u.UserID
    `;

    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching resources:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ resources: results });
    });
}

printmyResource(req, res) {
    const UserID = req.session.userId;

    const sql = `
        SELECT ResourceID, ResourceName, Description, Quantity, Cost, Availability, ImageURL
        FROM resource
        WHERE userid = ?
    `;

    db.query(sql, [UserID], (error, results) => {
        if (error) {
            console.error('Error fetching resources:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ resources: results });
    });
}
availableResource(req, res) {
    const sql = `
        SELECT r.ResourceID, r.ResourceName, r.Description, r.Quantity, r.Cost, r.Availability, r.ImageURL, u.Username, u.Email
        FROM resource r
        INNER JOIN users u ON r.userid = u.UserID
        WHERE r.Availability = 1
    `;

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

    const sql = `
        SELECT r.ResourceID, r.ResourceName, r.Description, r.Quantity, r.Cost, r.Availability, r.ImageURL, u.Username, u.Email
        FROM resource r
        INNER JOIN users u ON r.userid = u.UserID
        WHERE r.Cost <= ?
    `;

    db.query(sql, [maxcoast], (error, results) => {
        if (error) {
            console.error('Error fetching resources by maximum cost:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ resources: results });
    });
}
countMyResources(req, res) {
    const UserID = req.session.userId; // Retrieve the user ID from the session
    const sql = `SELECT COUNT(*) AS totalProjects FROM resource WHERE UserID = ?`;
    
    db.query(sql, [UserID], (error, results) => { // Pass UserID to the query
        if (error) {
            console.error('Error counting projects:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const totalProjects = results[0].totalProjects;
        res.status(200).json({ totalProjects });
    });
}




}

module.exports = ResourcesRepository;