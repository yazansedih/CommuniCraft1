const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ecotrack',
});

const ReportModel = {
  createReport: (userID, reportType, description, status) => {
    const submitDate = new Date();
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO reports (userID, reportType, description, submitDate, status) VALUES (?, ?, ?, ?, ?)';
      db.query(
        query,
        [userID, reportType, description, submitDate, status],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.insertId);
          }
        },
      );
    });
  },

  getAllReports: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM reports';
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  deleteReport: async (reportID) => {
    try {
      // Check if the report exists in the database
      const checkQuery = 'SELECT * FROM reports WHERE reportID = ?';
      const [checkRows] = await db.promise().query(checkQuery, [reportID]);

      if (checkRows.length === 0) {
        // Report not found in the database
        return 0;
      }

      // Report exists, proceed with deletion
      const deleteQuery = 'DELETE FROM reports WHERE reportID = ?';
      const [deleteResult] = await db.promise().query(deleteQuery, [reportID]);

      if (deleteResult.affectedRows > 0) {
        // Deletion successful
        return 1;
      } else {
        // Deletion failed
        return 0;
      }
    } catch (error) {
      throw error;
    }
  },
};

module.exports = ReportModel;
