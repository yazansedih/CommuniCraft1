const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const axios = require('axios');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'advdatabase',
});

class ExternalAPIsRepository {
    weather(req, res) {
        const { workshopid } = req.params; 
    
        var location;
    
        const sql = 'SELECT Location FROM localpartnerships WHERE WorkshopID = ?';
        db.query(sql, [workshopid], async (error, results) => {
            if (error) {
                console.error('Error searching for groups:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            const city = results[0];
            const apiKey = "ae9ea459294b4fd922724f65e987d22f";
            const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            let weather;
            let err = null;
    
            try {
                const response = await axios.get(APIUrl)
                weather = response.data;
                console.log(response);                
            } catch(err) {
                weather = null;
                console.error('Error fetching weather data:', err);
                return res.status(500).json({ error: 'Failed to fetch weather data!😢' });
            }
    
            res.render("index", {weather, err});
            // res.status(200).json({ weather });
        });
    }
    

}

module.exports = ExternalAPIsRepository;
