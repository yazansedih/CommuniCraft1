const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const { sequelize } = require('../models/Sequelize');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = {
    Username: req.body.username,
    Email: req.body.email,
    Password: req.body.password,
  };

  // Check if the username or email already exists
  const existingUser = await sequelize.query(
    'SELECT * FROM users WHERE Username = ? OR Email = ?',
    {
      replacements: [newUser.Username, newUser.Email],
      type: sequelize.QueryTypes.SELECT,
    },
  );

  if (existingUser.length > 0) {
    return res.status(409).json({
      status: 'error',
      message: 'Username or email already exists.',
    });
  }
  
  bcrypt.hash(newUser.Password, 10, async (hashError, hashedPassword) => {
    if (hashError) {
      console.error('Error hashing the password:', hashError);
      return res.status(500).json({
        status: 'error',
        message: 'Error hashing the password',
      });
    }

    newUser.Password = hashedPassword;
    const date = new Date();

    try {
      await sequelize.query(
        'INSERT INTO users (Username, Password, Email, Role, CraftSkill, CraftInterest, ProfilePicture, PartnerShipID, RegistrationDate, LastLoginDate, Active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        {
          replacements: [
            newUser.Username,            
            newUser.Password,
            newUser.Email,
            'user',
            null,
            null,
            null,
            null,
            date,
            null,
            '1',            
          ],
          type: sequelize.QueryTypes.INSERT,
        },
      );

      res.status(201).json({
        status: 'success',
        message: 'User created successfully.',
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
