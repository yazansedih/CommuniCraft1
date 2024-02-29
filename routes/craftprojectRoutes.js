const express = require('express');
const craftprojectController = require('../controllers/craftprojectController');
const { authenticateUser } = require('../middlewares/authenticateUser');
const authController = require('../controllers/authController');
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');

const router = express.Router();

router.post('/addproject',authenticateAdmin,craftprojectController.addproject);
router.put('/updateproject/:id', authenticateAdmin,craftprojectController.updateproject);
router.delete('/deleteproject/:id', authenticateAdmin,craftprojectController.deleteproject);
router.get('/searchproject/:id', authenticateAdmin,craftprojectController.searchproject);

router.get('/searchALLprojects', authenticateUser,craftprojectController.searchALLprojects);
router.get('/searchALLprojects', authenticateAdmin,craftprojectController.searchALLprojects);


router.get('/searchprojectbySkillLevel/:SkillLevel', authenticateAdmin,craftprojectController.searchprojectbySkillLevel);
router.get('/searchprojectbyGroupSize/:GroupSize', authenticateAdmin,craftprojectController.searchprojectbyGroupSize);



router.get('/searchprojectbyTitle/:Title', authenticateUser,craftprojectController.searchprojectbyTitle);
router.get('/searchprojectbyTitle/:Title', authenticateAdmin,craftprojectController.searchprojectbyTitle);


router.get('/getTitleById/:id', authenticateAdmin,craftprojectController.getTitleById);

router.get('/searchprojectbymaterial/:material', authenticateAdmin,craftprojectController.searchprojectbymaterial);






module.exports = router;
