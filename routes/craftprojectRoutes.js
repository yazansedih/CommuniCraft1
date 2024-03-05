const express = require('express');
const craftprojectController = require('../controllers/craftprojectController');
const { authenticateCustomer } = require('../middlewares/authenticateCustomer');
const { authenticateUser } = require('../middlewares/authenticateUser');
const authController = require('../controllers/authController');
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');

const router = express.Router();


router.post('/addproject', authenticateCustomer || authenticateAdmin, craftprojectController.addproject);


router.put('/updateproject/:id',authenticateCustomer || authenticateAdmin,craftprojectController.updateproject);
router.delete('/deleteproject/:id', authenticateCustomer || authenticateAdmin,craftprojectController.deleteproject);
router.get('/myProjects', authenticateCustomer, craftprojectController.myProjects);


//router.get('/searchproject/:id', authenticateCustomer || authenticateAdmin,craftprojectController.searchproject);

router.get('/searchALLprojects',craftprojectController.searchALLprojects);



router.get('/searchprojectbySkillLevel/:SkillLevel', authenticateCustomer || authenticateAdmin,craftprojectController.searchprojectbySkillLevel);
router.get('/searchprojectbyGroupSize/:GroupSize', authenticateCustomer || authenticateAdmin,craftprojectController.searchprojectbyGroupSize);



 router.get('/searchprojectbyTitle/:Title',craftprojectController.searchprojectbyTitle);



// router.get('/getTitleById/:id', authenticateCustomer || authenticateAdmin,craftprojectController.getTitleById);

router.get('/searchprojectbymaterial/:material', authenticateCustomer || authenticateAdmin,craftprojectController.searchprojectbymaterial);



module.exports = router;
