const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const { sequelize } = require('../models/Sequelize');


exports.signup = catchAsync(async (req, res, next) => {
  const newCompany = {
    Username: req.body.companyname,
    Email: req.body.email,
    Password: req.body.password,
    Companyname: req.body.name,
  };

  const existingCompany = await sequelize.query(
    'SELECT * FROM companies WHERE Username = ? OR Email = ? OR CompanyName = ?',
    {
      replacements: [newCompany.Username, newCompany.Email, newCompany.Companyname],
    },
  );

    console.log(existingCompany);
    console.log(existingCompany.length);

  if (existingCompany[0].length > 0) {
    return res.status(409).json({
      status: 'error',
      message: 'Username or Email or CompanyName already exists.',
    });
  }
  
  bcrypt.hash(newCompany.Password, 10, async (hashError, hashedPassword) => {
    if (hashError) {
      console.error('Error hashing the password:', hashError);
      return res.status(500).json({
        status: 'error',
        message: 'Error hashing the password',
      });
    }

    newCompany.Password = hashedPassword;
    const date = new Date();

    try {
      await sequelize.query(
        'INSERT INTO companies (Username, Password, Email, CompanyName, Specialty, Location, Employees, Description, RegistrationDate, LastLoginDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        {
          replacements: [
            newCompany.Username,            
            newCompany.Password,
            newCompany.Email,
            newCompany.Companyname,
            null,
            null,
            null,            
            null,   
            date,
            null,                 
          ],
        },
      );
      

      res.status(201).json({
        status: 'success',
        message: 'Company created successfully.',
      });
    } catch (insertError) {
      console.error('Error inserting into the database:', insertError);
      res.status(500).json({
        status: 'error',
        message: 'Error inserting into the database',
      });
    }
  });
});
