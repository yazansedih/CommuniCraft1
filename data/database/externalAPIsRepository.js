const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const axios = require('axios');
require('dotenv').config();


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'advdatabase',
});

class ExternalAPIsRepository {
    weather(req, res) {
        const { workshopid } = req.params; 
        
        const sql = 'SELECT Location FROM localpartnerships WHERE WorkshopID = ?';
        db.query(sql, [workshopid], async (error, results) => {
            if (error) {
                console.error('Error searching for groups:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            const city = results[0].Location;
            const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
            
            const apiKey = "ae9ea459294b4fd922724f65e987d22f";
            const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capitalizedCity}&appid=${apiKey}&units=metric`;
            let weather;
    
            try {
                const response = await axios.get(APIUrl);
                weather = response.data;
            } catch(err) {
                weather = null;
                console.error('Error fetching weather data:', err);
                return res.status(500).json({ error: 'Failed to fetch weather data!😢' });
            }
    
            res.status(200).json({ weather });
        });
    }



    

}

module.exports = ExternalAPIsRepository;
