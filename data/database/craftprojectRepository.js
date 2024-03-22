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

class CraftprojectRepository {

    addproj(req, res) {
       

        const { Title, Description, materials, workshopID } = req.body;
        const customerID = req.session.userId;
    
        // Validate required fields
        // if (!Title || !Description || !materials || materials.length === 0 || !Status || !workshopID) {
        //     return res.status(400).json({ error: 'All fields are required' });
        // }

    
        // Validate SkillLevel
       
    
        // Query to check if workshopID exists in localpartnerships table
        const checkWorkshopSql = 'SELECT WorkshopID FROM localpartnerships WHERE WorkshopID = ?';
    
        db.query(checkWorkshopSql, [workshopID], (workshopError, workshopResults) => {
            if (workshopError) {
                console.error('Error checking workshop existence:', workshopError);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            if (workshopResults.length === 0) {
                return res.status(404).json({ error: 'Workshop not found' });
            }
    
            // If workshop exists, proceed to insert the project
            const sql = 'INSERT INTO craftprojects (CustomerID, Title, Description, materials, Status, WorkshopID) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(sql, [customerID, Title, Description, JSON.stringify(materials), null, workshopID], (error, results) => {
                if (error) {
                    console.error('Error inserting project:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(201).json({ message: 'Project added successfully', projectId: results.insertId });
            });

        });
    }
    updateproj(req, res) {
        const { id } = req.params;
        // const projectId = parseInt(id); // Parse 'id' as an integer
        const { Title, Description,  materials, Status, workshopID } = req.body;
        const CustomerID = req.session.userId;
    
        // Check if the project ID exists and belongs to the authenticated user
        db.query('SELECT CustomerID FROM craftprojects WHERE ProjectID = ?', [id], (error, rows) => {
            if (error) {
                console.error('Error checking Project ID:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            if (rows.length === 0) {
                // The Project ID provided is not valid
                return res.status(404).json({ error: 'Invalid Project ID' });
            }
    
            // Check if the project exists and belongs to the authenticated user
            if (rows[0].CustomerID !== CustomerID) {
                // The Project exists but the Customer is not authorized to update it
                return res.status(403).json({ error: "You're not authorized to update this Project" });
            }
    
            // Check if the workshopID exists in the localpartnerships table
            db.query('SELECT * FROM localpartnerships WHERE WorkshopID = ?', [workshopID], (error, workshopRows) => {
                if (error) {
                    console.error('Error checking workshop ID:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }
    
                if (workshopRows.length === 0) {
                    // The workshopID provided is not valid
                    return res.status(404).json({ error: 'Invalid workshop ID' });
                }
                //
                const materialsString = materials.join(', ');



                //
    
                // Update the project with the provided data
                const sql = `UPDATE craftprojects
                SET Title = ?,
                    Description = ?,
                    materials = ?,
                    Status = ?,
                    workshopID = ?
                WHERE ProjectID = ? AND CustomerID = ?`;
    
                db.query(sql, [Title, Description, materialsString, Status, workshopID, id, CustomerID], (error, results) => {
                    if (error) {
                        console.error('Error updating project:', error);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
    
                    // Check if the project was updated successfully
                    if (results.affectedRows === 0) {
                        // The project was not updated
                        return res.status(500).json({ error: 'Failed to update project' });
                    }
    
                    // Send response indicating successful update of the project
                    res.status(200).json({ message: 'Project updated successfully', ProjectID: id });
                });
            });
        });
    }

//

    
    
          

    
    deleteproj(req, res) {
        const { id } = req.params; 
        const customerID = req.session.userId;
        
        db.query('SELECT customerID FROM craftprojects WHERE ProjectID = ?', [id], (error, rows) => {
            if (error) {
                console.error('Error checking Project ID:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            // Check if the project ID does not exist in the database
            if (rows.length === 0) {
                // The Project ID provided is not valid
                return res.status(404).json({ error: 'Project not found' });
            }
    
            // Check if the project exists and belongs to the authenticated user
            if (rows[0].customerID !== customerID) {
                // The project exists but the user is not authorized to delete it
                return res.status(403).json({ error: "You're not authorized to delete this Project" });
            }
            
            // Construct the SQL query for deleting the project
            const sql = 'DELETE FROM craftprojects WHERE ProjectID = ? AND CustomerID = ?';
            
            // Execute the query
            db.query(sql, [id, customerID], (error, results) => {
                if (error) {
                    console.error('Error deleting project:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }
    
                if (results.affectedRows === 0) {
                    return res.status(500).json({ error: 'Failed to delete project' });
                }
    
                // Send a success response if the project was deleted successfully
                res.status(200).json({ message: 'Project deleted successfully', ProjectID: id });
            });
        });
    }
    
    
        



    myProjects(req, res) {
        const customerID = req.session.userId;
    
        // SQL query to fetch myProjects with workshop name and location
        const sqlQuery = `
            SELECT cp.ProjectID, cp.Title, cp.Description, cp.materials, cp.Status, cp.WorkshopID, lp.WorkshopName, lp.Location
            FROM craftprojects cp
            JOIN localpartnerships lp ON cp.WorkshopID = lp.WorkshopID
            WHERE cp.CustomerID = ?
        `;
        db.query(sqlQuery, [customerID], (error, results) => {
            if (error) {
                console.error('Error fetching projects:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            res.status(200).json({ myProjects: results });
        });
    }
    countMyprojects(req, res) {
        const customerID = req.session.userId;
        const sql = `SELECT COUNT(*) AS totalProjects FROM craftprojects WHERE CustomerID = ?`;
    
        db.query(sql, [customerID], (error, results) => {
            if (error) {
                console.error('Error counting projects:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            const totalProjects = results[0].totalProjects;
            res.status(200).json({ totalProjects });
        });
    }
    

    


    searchALLprojects(req, res) {
        const sql = `
            SELECT cp.Title, cp.Description,cp.materials, cp.Status, lp.WorkshopName, lp.Location
            FROM craftprojects cp
            JOIN localpartnerships lp ON cp.WorkshopID = lp.WorkshopID
        `;
    
        db.query(sql, (error, results) => {
            if (error) {
                console.error('Error fetching projects:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            res.status(200).json({ projects: results });
        });
    }

    countALLprojects(req, res) {
        const sql = `SELECT COUNT(*) AS totalProjects FROM craftprojects`;
    
        db.query(sql, (error, results) => {
            if (error) {
                console.error('Error counting projects:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            const totalProjects = results[0].totalProjects;
            res.status(200).json({ totalProjects });
        });
    }
    
    searchprojectbymaterial(req, res) {
        const { material } = req.params;
    
        // SQL query to search projects by material (case-insensitive)
        const sql = `
            SELECT cp.Title, cp.Description,cp.materials, cp.Status, lp.WorkshopName, lp.Location
            FROM craftprojects cp
            JOIN localpartnerships lp ON cp.WorkshopID = lp.WorkshopID
            WHERE cp.materials LIKE ?
        `;
    
        // Execute the SQL query
        db.query(sql, [`%${material}%`], (error, results) => {
            if (error) {
                console.error('Error searching projects by material:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            // Send the retrieved projects data as a response
            res.status(200).json({ projects: results });
        });
    }
    
    
    
    
    
    
    // searchprojectbySkillLevel(req, res) {
    //     const { SkillLevel } = req.params;
    
    //     // SQL query to search projects by skill level (case-insensitive)
    //     const sql = `
    //         SELECT cp.Title, cp.Description, cp.SkillLevel, cp.GroupSize, cp.materials, cp.Status, lp.WorkshopName, lp.Location
    //         FROM craftprojects cp
    //         JOIN localpartnerships lp ON cp.WorkshopID = lp.WorkshopID
    //         WHERE cp.SkillLevel COLLATE utf8mb4_general_ci = ?
    //     `;
    
    //     // Execute the SQL query
    //     db.query(sql, [SkillLevel], (error, results) => {
    //         if (error) {
    //             console.error('Error searching for projects by SkillLevel:', error);
    //             return res.status(500).json({ error: 'Internal server error' });
    //         }
    
    //         // Send the retrieved projects data as a response
    //         res.status(200).json({ projects: results });
    //     });
    // }
    
    
    
    // searchprojbyGroupSize(req, res) {
    //     const { GroupSize } = req.params;
    
    //     // SQL query to search projects by group size
    //     const sql = `
    //         SELECT cp.Title, cp.Description, cp.SkillLevel, cp.GroupSize, cp.materials, cp.Status, lp.WorkshopName, lp.Location
    //         FROM craftprojects cp
    //         JOIN localpartnerships lp ON cp.WorkshopID = lp.WorkshopID
    //         WHERE cp.GroupSize = ?
    //     `;
    
    //     // Execute the SQL query
    //     db.query(sql, [GroupSize], (error, results) => {
    //         if (error) {
    //             console.error('Error searching for projects by GroupSize:', error);
    //             return res.status(500).json({ error: 'Internal server error' });
    //         }
    
    //         // Send the retrieved projects data as a response
    //         res.status(200).json({ projects: results });
    //     });
    // }
    
    searchprojectbyContainTitle(req, res) {
        const { Title } = req.params;
    
        // SQL query to search projects by title and join with the customername table
        const sql = `
        SELECT cp.Title, cp.Description,cp.materials, cp.Status, lp.WorkshopName, lp.Location
        FROM craftprojects cp
        JOIN localpartnerships lp ON cp.WorkshopID = lp.WorkshopID
        WHERE cp.Title LIKE ?
        
        `;
    
        // Add wildcard '%' to search for titles containing the specified value
        const searchTerm = `%${Title}%`;
    
        // Execute the SQL query
        db.query(sql, [searchTerm], (error, results) => {
            if (error) {
                console.error('Error searching for projects by Title:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            // Send the retrieved projects data as a response
            res.status(200).json({ projects: results });
        });
    }
    
// getTitleById(req, res) {
//     const { id } = req.params;

   
//     const sql = 'SELECT Title FROM craftprojects WHERE ProjectID = ?';

    
//     db.query(sql, [id], (error, results) => {
//         if (error) {
//             console.error('Error retrieving title by ID:', error);
//             return res.status(500).json({ error: 'Internal server error' });
//         }

        
//         if (results.length === 0) {
//             return res.status(404).json({ error: 'Project not found' });
//         }

        
//         const title = results[0].Title;
//         res.status(200).json({ title });
//     });
// }
workshop(req, res) {
    
    const sql = `
    SELECT lp.WorkshopID, lp.WorkshopName, lp.Location, lp.Description, lp.ContactInfo, u.Username
    FROM localpartnerships lp
    INNER JOIN users u ON lp.OwnerID = u.UserID;
  `;


db.query(sql, (error, results) => {
  if (error) {
      console.error('Error fetching workshops :', error);
      return res.status(500).json({ error: 'Internal server error' });
  }

  res.status(200).json({  workshops: results });
  
});

}

}




module.exports = CraftprojectRepository;