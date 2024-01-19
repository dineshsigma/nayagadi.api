var express = require('express');
var router = express.Router();
let location = require('../controllers/locationcontrollers.js');
router.get('/getLocationTaxes',location.getLocationTaxes);
router.get('/getStatesAndCities',location.getStatesAndCities);
router.get('/getVarientsBasedOnLocationtaxes',location.getVarientsBasedOnLocationtaxes);
router.get('/getcities',location.cityDropDown);

module.exports = router;
