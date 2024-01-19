var express = require('express');
var router = express.Router();
let news= require('../controllers/newscontrollers');
router.get('/latestnews',news.latestNews);
router.get('/trendingnews',news.trendingNews);


module.exports = router;
