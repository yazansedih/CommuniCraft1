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

    const sql = 'INSERT INTO localpartnerships (WorkshopName, Location, Description, ContactInfo , GroupSize, Cost) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [workshopname, location, description, contactinfo , groupsize, cost], (error, results) => {
        if (error) {
            console.error('Error inserting project:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'Workshop added successfully', workshopId: results.insertId });
    });
  }


}

module.exports = LocalpartnershipRepository;