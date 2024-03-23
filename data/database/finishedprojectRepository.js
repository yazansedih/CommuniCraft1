
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'advdatabase',
});

class FinishedprojectRepository {
  // Función para obtener el informe del sistema
  getSystemReport(callback) {
    const sqlQuery = `
      SELECT 
        COUNT(UserID) AS TotalUsers,
        SUM(CASE WHEN Active = 1 THEN 1 ELSE 0 END) AS ActiveUsers,
        SUM(CASE WHEN Active = 0 THEN 1 ELSE 0 END) AS InactiveUsers,
        COUNT(DISTINCT GroupID) AS TotalGroups
      FROM 
        users;
    `;

    db.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('Error fetching system report:', err);
        return callback(err, null);
      }

      const systemReport = {
        totalUsers: results[0].TotalUsers,
        activeUsers: results[0].ActiveUsers,
        inactiveUsers: results[0].InactiveUsers,
        totalGroups: results[0].TotalGroups
      };

      callback(null, systemReport);
    });
  }
  allFinishedProjects(req, res) {

    const sql = "SELECT * FROM craftprojects Status = 1";
    db.query(sql, (error, results) => {
      if (error) {
        console.error("Error finished project:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "There is no finished projects!😢" });
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
