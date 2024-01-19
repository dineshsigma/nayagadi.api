var express = require('express');
var router = express.Router();
let enquiry = require('../controllers/enquirycontroller.js');
router.post('/CreateEnquiryForm',enquiry.CreateEnquiryForm);
module.exports = router;
