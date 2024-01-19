var express = require('express');
var router = express.Router();
let careers= require('../controllers/careerscontrollers');
router.post('/getUploadUrl',careers.getUploadUrl);
router.post('/applyjobs',careers.applyCareersJob)
module.exports = router;
