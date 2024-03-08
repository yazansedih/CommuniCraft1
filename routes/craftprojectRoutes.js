const express = require('express');
const craftprojectController = require('../controllers/craftprojectController');
const { authenticateCustomer } = require('../middlewares/authenticateCustomer');
const { authenticateUser } = require('../middlewares/authenticateUser');
const authController = require('../controllers/authController');
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');
const { authenticateArtisan } = require('../middlewares/authenticateArtisan');
const { ACA } = require('../middlewares/Admin_Customer_Artisan');


const router = express.Router();




router.post('/addproject', authenticateCustomer, craftprojectController.addproject);
router.put('/updateproject/:id',  authenticateCustomer, craftprojectController.updateproject);
router.delete('/deleteproject/:id',  authenticateCustomer, craftprojectController.deleteproject);


router.get('/myProjects', authenticateCustomer, craftprojectController.myProjects);
router.get('/countMyprojects',authenticateCustomer,craftprojectController.countMyprojects);


//router.get('/searchproject/:id', authenticateCustomer || authenticateAdmin,craftprojectController.searchproject);



router.get('/searchALLprojects',  ACA , craftprojectController.searchALLprojects);

router.get('/countALLprojects', ACA , craftprojectController.countALLprojects);



// router.get('/searchprojectbySkillLevel/:SkillLevel',  authenticateAdmin,craftprojectController.searchprojectbySkillLevel);
// router.get('/searchprojectbyGroupSize/:GroupSize', authenticateAdmin,craftprojectController.searchprojectbyGroupSize);
router.get('/searchprojectbymaterial/:material',authenticateAdmin,craftprojectController.searchprojectbymaterial);
 router.get('/searchprojectbyContainTitle/:Title',authenticateAdmin,craftprojectController.searchprojectbyContainTitle);



// router.get('/getTitleById/:id', authenticateCustomer || authenticateAdmin,craftprojectController.getTitleById);




module.exports = router;
