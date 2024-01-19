var express = require('express');
var router = express.Router();
let homepage = require('../controllers/homepagecontrollers');

router.get('/getAboutus',homepage.Aboutus);
router.get('/getfaqs',homepage.getFAQS);
router.get('/getblogs',homepage.Blogs);
router.get('/getnews',homepage.News)
router.get('/getNewsById',homepage.getNewsById);
router.get('/getBlogsById',homepage.getBlogsById);
router.get('/searchVehiclesWithLogos',homepage.searchVehiclesWithLogos);
router.get('/groupByBrandsWithvarients',homepage.groupByBrandsWithvarients);
router.post('/createlogs',homepage.logs);
router.get('/getbrandLogosBasedOnCategory',homepage.getbrandLogosBasedOnCategory);
router.get('/getCarTypeBasedOnBrand',homepage.getCarTypeBasedOnBrand);
router.get('/listofFuelTypes',homepage.listofFuelTypes);
router.get('/getModelNameBasedOnBrandAndCarType',homepage.getModelNameBasedOnBrandAndCarType);
router.get('/ListOfCategory',homepage.ListOfCategory)
router.get('/homepageads',homepage.homePageAds);

module.exports = router;
