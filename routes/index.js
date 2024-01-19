var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
 return res.send('server is running .......')
});

module.exports = router;
