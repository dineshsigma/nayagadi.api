var express = require('express');
var router = express.Router();
let validations = require('../controllers/validationcontrollers.js');
router.post('/models',validations.modelValidations);


module.exports = router;
