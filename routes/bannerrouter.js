var express = require('express');
var router = express.Router();
let banners = require('../controllers/bannerscontroller.js');
router.post('/createBanners',banners.CreateBanners);
router.get('/getbannerDetails',banners.getBannerWithProductDetails);

module.exports = router;
