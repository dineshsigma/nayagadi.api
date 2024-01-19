var express = require('express');
var router = express.Router();
let blogs= require('../controllers/blogscontrollers');
router.get('/latestblogs',blogs.latestBlogs)
router.get('/trendingblogs',blogs.trendingBlogs)


module.exports = router;
