var express = require('express');
var router = express.Router();
let footer = require('../controllers/footercontroller');
router.post('/createfooter',footer.createFooter);
router.get('/getFooterDetails',footer.getFooterDetails);
router.get('/gettermsandcondition',footer.TermsAndCondition);
router.get('/privacyPolicy',footer.PrivacyPolicy);
router.post('/contactUs',footer.contactUs);
router.get('/carrers',footer.carrers);
router.get('/careersByid',footer.careersByid);

module.exports = router;
