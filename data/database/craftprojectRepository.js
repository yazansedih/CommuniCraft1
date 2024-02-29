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
    const { Title, Description, SkillLevel, GroupSize, materials } = req.body;

    const sql = 'INSERT INTO craftprojects (Title, Description, SkillLevel, GroupSize, materials) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [Title, Description, SkillLevel, GroupSize, JSON.stringify(materials)], (error, results) => {
        if (error) {
            console.error('Error inserting project:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Project added successfully', projectId: results.insertId });
    });
}
updateproj(req, res) {
    const { id } = req.params; 
    const projectId = parseInt(id); // Parse 'id' as an integer
    const { Title, Description, SkillLevel, GroupSize, materials } = req.body;

    
    const sql = 'UPDATE craftprojects SET Title = ?, Description = ?, SkillLevel = ?, GroupSize = ?, materials = ? WHERE ProjectID = ?';

    
    db.query(sql, [Title, Description, SkillLevel, GroupSize, JSON.stringify(materials), projectId], (error, results) => {
        if (error) {
            console.error('Error updating project:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

      
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

       
        res.status(200).json({ message: 'Project updated successfully', projectId: projectId });
    });
}
deleteproj(req, res) {
    const { id } = req.params; 
const projectId = parseInt(id); // Parse 'id' as an integer

const sql = 'DELETE FROM craftprojects WHERE ProjectID = ?';

db.query(sql, [projectId], (error, results) => {
if (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ error: 'Internal server error' });
}

if (results.affectedRows === 0) {
    return res.status(404).json({ error: 'Project not found' });
}

res.status(200).json({ message: 'Project deleted successfully', projectId: projectId });
});
}
searchproj(req, res) {
    const { id } = req.params;

   
    const sql = 'SELECT * FROM craftprojects WHERE ProjectID = ?';

    
    db.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Error searching for project:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

       
        if (results.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        
        res.status(200).json({ project: results[0] });
    });
}
searchallprojs(req, res) {
    
    const sql = 'SELECT * FROM craftprojects';

    
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error searching for projects:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        
        res.status(200).json({ projects: results });
    });
}
searchprojectbymaterial(req, res) {
    const { material } = req.params;

   
    const sql = 'SELECT * FROM craftprojects WHERE JSON_CONTAINS(materials, ?)';

  
    db.query(sql, [`"${material}"`], (error, results) => {
        if (error) {
            console.error('Error searching projects by material:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

       
        res.status(200).json({ projects: results });
    });
}
searchprojbySkillLevel(req, res) {
    const { SkillLevel } = req.params;

   
    const sql = 'SELECT * FROM craftprojects WHERE SkillLevel = ?';

    
    db.query(sql, [SkillLevel], (error, results) => {
        if (error) {
            console.error('Error searching for projects by SkillLevel:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

       
        res.status(200).json({ projects: results });
    });
}
searchprojbyGroupSize(req, res) {
    const { GroupSize } = req.params;

  
    const sql = 'SELECT * FROM craftprojects WHERE GroupSize = ?';

    
    db.query(sql, [GroupSize], (error, results) => {
        if (error) {
            console.error('Error searching for projects by GroupSize:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

       
        res.status(200).json({ projects: results });
    });
}
searchprojbyTitle(req, res) {
    const { Title } = req.params;

    
    const sql = 'SELECT * FROM craftprojects WHERE Title = ?';

   
    db.query(sql, [Title], (error, results) => {
        if (error) {
            console.error('Error searching for projects by Title:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

       
        res.status(200).json({ projects: results });
    });
}
getTitleById(req, res) {
    const { id } = req.params;

   
    const sql = 'SELECT Title FROM craftprojects WHERE ProjectID = ?';

    
    db.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Error retrieving title by ID:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        
        const title = results[0].Title;
        res.status(200).json({ title });
    });
}


}

module.exports = CraftprojectRepository;