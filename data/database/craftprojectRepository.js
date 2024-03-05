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
        const { Title, Description, SkillLevel, GroupSize, materials, Status, workshopID } = req.body;
        const customerID = req.session.userId;
    
        // Validate required fields
        if (!Title || !Description || !SkillLevel || !GroupSize || !materials || !Status || !workshopID) {
            return res.status(400).json({ error: 'All fields are required' });
        }

    
        // Validate SkillLevel
        if (!['beginner', 'intermediate', 'advanced'].includes(SkillLevel.toLowerCase())) {
            return res.status(400).json({ error: 'Invalid SkillLevel' });
        }
    
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
            const sql = 'INSERT INTO craftprojects (CustomerID, Title, Description, SkillLevel, GroupSize, materials, Status, WorkshopID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
            db.query(sql, [customerID, Title, Description, SkillLevel, GroupSize, JSON.stringify(materials), Status, workshopID], (error, results) => {
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
        const projectId = parseInt(id); // Parse 'id' as an integer
        const customerID = req.session.userId;
        const { Title, Description, SkillLevel, GroupSize, materials, Status, workshopID } = req.body;
    
        // Construct the SQL query for updating the project
        const sql = 'UPDATE craftprojects SET Title = ?, Description = ?, SkillLevel = ?, GroupSize = ?, materials = ? WHERE ProjectID = ? AND CustomerID = ?';
    
        // Execute the query
        db.query(sql, [Title, Description, SkillLevel, GroupSize, JSON.stringify(materials), projectId, customerID], (error, results) => {
            if (error) {
                console.error('Error updating project:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            // Check if the project was found and updated
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Project not found or you do not have permission to update this project' });
            }
    
            // Send a success response if the project was updated successfully
            res.status(200).json({ message: 'Project updated successfully', projectId: projectId });
        });
    }
    deleteproj(req, res) {
        const { id } = req.params; 
        const customerID = req.session.userId;
        const projectId = parseInt(id); // Parse 'id' as an integer
    
        // Construct the SQL query for deleting the project
        const sql = 'DELETE FROM craftprojects WHERE ProjectID = ? AND CustomerID = ?';
    
        // Execute the query
        db.query(sql, [projectId, customerID], (error, results) => {
            if (error) {
                console.error('Error deleting project:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            // Check if the project was found and deleted
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Project not found or you do not have permission to delete this project' });
            }
    
            // Send a success response if the project was deleted successfully
            res.status(200).json({ message: 'Project deleted successfully', projectId: projectId });
        });
    }
    myProjects(req, res) {
        const customerID = req.session.userId;
    
        // SQL query to fetch myProjects with workshop name and location
        const sqlQuery = `
            SELECT cp.Title, cp.Description, cp.SkillLevel, cp.GroupSize, cp.materials, cp.Status, lp.WorkshopName, lp.Location
            FROM craftprojects cp
            JOIN localpartnerships lp ON cp.WorkshopID = lp.WorkshopID
            WHERE cp.CustomerID = ?
        `;
    
        // Execute the SQL query
        sequelize.query(sqlQuery, {
            replacements: [customerID], // Provide the value for the placeholder
            type: sequelize.QueryTypes.SELECT // Specify the query type as SELECT
        })
        .then(myProjects => {
            // Send the retrieved myProjects data as a response
            res.json({ status: "success", myProjects });
        })
        .catch(error => {
            // Handle any errors that occur during the database operation
            console.error("Error fetching myProjects:", error);
            res.status(500).json({ status: "error", message: "Failed to fetch myProjects" });
        });
    }


    searchAllProjects(req, res) {
        const sql = `
            SELECT cp.Title, cp.Description, cp.SkillLevel, cp.GroupSize, cp.materials, cp.Status, lp.WorkshopName, lp.Location
            FROM craftprojects cp
            JOIN localpartnerships lp ON cp.WorkshopID = lp.WorkshopID
        `;
    
        db.query(sql, (error, results) => {
            if (error) {
                console.error('Error searching for projects:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            // Send the retrieved projects data as a response
            res.status(200).json({ projects: results });
        });
    }
    searchProjectByMaterial(req, res) {
        const { material } = req.params;
    
        // SQL query to search projects by material (case-insensitive)
        const sql = `
            SELECT cp.Title, cp.Description, cp.SkillLevel, cp.GroupSize, cp.materials, cp.Status, lp.WorkshopName, lp.Location
            FROM craftprojects cp
            JOIN localpartnerships lp ON cp.WorkshopID = lp.WorkshopID
            WHERE JSON_CONTAINS(cp.materials, ? COLLATE utf8_general_ci)
        `;
    
        // Execute the SQL query
        db.query(sql, [`"${material}"`], (error, results) => {
            if (error) {
                console.error('Error searching projects by material:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            // Send the retrieved projects data as a response
            res.status(200).json({ projects: results });
        });
    }
    
    searchProjBySkillLevel(req, res) {
        const { SkillLevel } = req.params;
    
        // SQL query to search projects by skill level (case-insensitive)
        const sql = `
            SELECT cp.Title, cp.Description, cp.SkillLevel, cp.GroupSize, cp.materials, cp.Status, lp.WorkshopName, lp.Location
            FROM craftprojects cp
            JOIN localpartnerships lp ON cp.WorkshopID = lp.WorkshopID
            WHERE cp.SkillLevel COLLATE utf8_general_ci = ?
        `;
    
        // Execute the SQL query
        db.query(sql, [SkillLevel], (error, results) => {
            if (error) {
                console.error('Error searching for projects by SkillLevel:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            // Send the retrieved projects data as a response
            res.status(200).json({ projects: results });
        });
    }
    
    
    searchprojbyGroupSize(req, res) {
        const { GroupSize } = req.params;
    
        // SQL query to search projects by group size
        const sql = `
            SELECT cp.Title, cp.Description, cp.SkillLevel, cp.GroupSize, cp.materials, cp.Status, lp.WorkshopName, lp.Location
            FROM craftprojects cp
            JOIN localpartnerships lp ON cp.WorkshopID = lp.WorkshopID
            WHERE cp.GroupSize = ?
        `;
    
        // Execute the SQL query
        db.query(sql, [GroupSize], (error, results) => {
            if (error) {
                console.error('Error searching for projects by GroupSize:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            // Send the retrieved projects data as a response
            res.status(200).json({ projects: results });
        });
    }
    
searchProjByTitle(req, res) {
    const { Title } = req.params;

    // SQL query to search projects by title and join with the customername table
    const sql = `
        SELECT cp.Title, cp.Description, cp.SkillLevel, cp.GroupSize, cp.materials, cp.Status, lp.WorkshopName, lp.Location
        FROM craftprojects cp
        JOIN customername cn ON cp.CustomerID = cn.CustomerID
        WHERE cp.Title = ?
    `;

    // Execute the SQL query
    db.query(sql, [Title], (error, results) => {
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


}

module.exports = CraftprojectRepository;