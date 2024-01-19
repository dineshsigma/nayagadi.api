var express = require('express');
var router = express.Router();
let modelvarient = require('../controllers/modelvarientcontroller');
router.post('/createModelVarient',modelvarient.createModelVarient);
router.post('/createbrands',modelvarient.createBrands);
router.post('/createfuel',modelvarient.createFuelType);
router.post('/createfeatures',modelvarient.createFeatures);
router.get('/getmodelVarient',modelvarient.getModelVarient);
router.get('/getbrandnames',modelvarient.ListOfBrandnames);
router.get('/getmodelVarients',modelvarient.getListOfModelVarients);
router.get('/getModelVarientsById',modelvarient.getModelVarientsById);
router.get('/getMultipleVarientsByids',modelvarient.getMultipleVarientsByIds);
router.get('/getRelatedVarients',modelvarient.getRelatedVarients);
router.get('/getVarientsBasedOnFuel',modelvarient.getVarientsBasedOnFuel);
router.put('/updateSpecificationsVarientsById',modelvarient.updateSpecificationsVarientsById);
router.get('/getVarientSpecificationHighestPrice',modelvarient.getVarientSpecificationHighestPrice);
router.post('/downloadBrochureAPI',modelvarient.downloadBrochureFormApi);
module.exports = router;


//search with productname,brand
//price  range with suv
//brands with modelname