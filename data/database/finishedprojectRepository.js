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

class FinishedprojectRepository {
    // write your functions ...

}

module.exports = FinishedprojectRepository;