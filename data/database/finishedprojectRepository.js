const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "advdatabase",
});

class FinishedprojectRepository {

  allFinishedProjects(req, res) {
    const sql = "SELECT * FROM craftprojects WHERE Status = 1";
    db.query(sql, (error, results) => {
        if (error) {
            console.error("Error fetching finished projects:", error);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) { 
            return res.status(404).json({ message: "There are no finished projects" });
        }
        
        return res.status(200).json({ finishedProjects: results });
    });
  }

  finishedProjectById(req, res) {

    const { projectid } = req.params;

    const sql = "SELECT * FROM craftprojects WHERE ProjectID = ? AND Status = 1";
    db.query(sql, [projectid], (error, results) => {
      if (error) {
        console.error("Error finished project:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "This project not finshed or not found!😢" });
      }

      return res.status(200).json({ finishedProject: results });
    });
  }


}

module.exports = FinishedprojectRepository;
