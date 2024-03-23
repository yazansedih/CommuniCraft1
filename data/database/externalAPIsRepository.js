const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const axios = require('axios');
const http = require('node:http');
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

    news(req, res) {
        const { workshopid } = req.params; 
        
        const sql = 'SELECT * FROM localpartnerships WHERE WorkshopID = ?';
        db.query(sql, [workshopid], async (error, results) => {
            if (error) {
                console.error('Error searching for groups:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
    if (results.length === 0) {
        return res.status(404).json({ error: 'Workshop not found' });
    }
    
            const data = results[0].WorkshopName;
            
            const apiKey = "158006db2acd4881ab5b3264e1737177";
            const APIUrl = `https://newsapi.org/v2/everything?q=${data}&from=2024-02-21&sortBy=publishedAt&apiKey=${apiKey}`;
            let news;
    
            try {
                const response = await axios.get(APIUrl);
                news = response.data;
            } catch(err) {
                news = null;
                console.error('Error fetching news data:', err);
                return res.status(500).json({ error: 'Failed to fetch news data!😢' });
            }
    
            res.status(200).json({ news });
        });
    }

    userData(req, res) {
        // Initialize ipAddress variable
        let ipAddress = '';
    
        // Create options for the HTTP request
        const options = {
            host: "api.ipify.org",
            path: "/"
        };
    
        http.get(options, (response) => {
            response.setEncoding('utf8');
    
            response.on('data', (chunk) => {
                ipAddress += chunk;
            });
            
            response.on('end', () => {
                const { userId } = req.session;

                const sql = 'SELECT * FROM users WHERE UserID = ?';
                db.query(sql, [userId], async (error, results) => {
                    if (error) {
                        console.error('Error searching for users:', error);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    
                    const apiKey = "at_ZExKAjnJyDEBTVmdSe3NH7C0Wp3eI";
                    const APIUrl = `https://geo.ipify.org/api/v2/country?apiKey=${apiKey}&ipAddress=${ipAddress}`;
                    let data;
    
                    try {
                        const response = await axios.get(APIUrl);
                        data = response.data;
                    } catch(err) {
                        data = null;
                        console.error('Error fetching data:', err);
                        return res.status(500).json({ error: 'Failed to fetch data!😢' });
                    }
    
                    res.status(200).json({ data });
                });
            });
        }).on('error', (error) => {
            console.error(`Error retrieving IP address: ${error.message}`);
            return res.status(500).json({ error: 'Failed to retrieve IP address!😢' });
        });
    }

}

module.exports = ExternalAPIsRepository;
