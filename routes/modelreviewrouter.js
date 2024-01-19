var express = require('express');
var router = express.Router();
let modelReviews = require('../controllers/modelreviewscontollers.js');
router.post('/addmodelreviews',modelReviews.modelReviews);
router.get('/getmodelreviews',modelReviews.getModelReviews);


module.exports = router;