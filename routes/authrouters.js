var express = require('express');
var router = express.Router();
let auth= require('../controllers/authcontrollers');
router.post('/createUser',auth.createUsers);
router.post('/login',auth.userLogin);
router.post('/sendotp',auth.sendOtp);
router.post('/verifyotp',auth.verifyOtp);

module.exports = router;
