const express = require('express');
const companiesController = require('../controllers/companiesController');
// const { authenticateUser } = require('../middlewares/authenticateUser');
const authCompaniesController = require('../controllers/authCompaniesController');

const router = express.Router();

// Routes for user registration and authentication
router.post('/signup', authCompaniesController.signup); //api/companies/signup
router.post('/login', companiesController.loginCompany);

router
  .route('/profile')
  .get(companiesController.getCompanyProfile)
  .put(companiesController.updateCompanyProfile);

router
  .patch('/profile/companyname', companiesController.updateCompanyProfile)
  .patch('/profile/password', companiesController.updateCompanyProfile)
  .patch('/profile/email', companiesController.updateCompanyProfile)
  .patch('/profile/specialty', companiesController.updateCompanyProfile)
  .patch('/profile/location', companiesController.updateCompanyProfile)
  .patch('/profile/employees', companiesController.updateCompanyProfile)
  .patch('/profile/description', companiesController.updateCompanyProfile);
  
router.delete('/delete', companiesController.deleteCompany);

router.get('/logout', companiesController.logoutCompany);


router.get('/searchallworkshops', companiesController.searchAllWorkshops);

router.get('/searchworkshop/:workshopid', companiesController.searchWorkshop);

router.get('/searchworkshopisupport', companiesController.searchWorkshopiSupport);

router.post('/providesupportworkshop/:workshopid', companiesController.provideSupportWorkshop);

router.delete('/cancelsupportworkshop/:workshopid', companiesController.cancelSupportWorkshop);

module.exports = router;
