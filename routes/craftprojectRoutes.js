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



router.get('/workshop', authenticateCustomer, craftprojectController.workshop);

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


router.post('/communication/sendMessage/:projectid', authenticateCustomer, craftprojectController.sendMessage);
router.get('/communication/receivedMessages/:projectid', authenticateCustomer, craftprojectController.receivedMessages);
router.get('/communication/sentMessages/:projectid', authenticateCustomer ,craftprojectController.sentMessages);
router.delete('/communication/deleteMessage/:projectid/:messageid', craftprojectController.deleteMessage);
router.delete('/communication/deleteMessageHistory/:projectid', authenticateCustomer, craftprojectController.deleteMessageHistory);


module.exports = router;
