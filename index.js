
var express = require('express');
var cors = require('cors');
var app = express();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let enquiryRouter = require('./routes/enquiryrouter.js');
let modelVarientRouter = require('./routes/modelrouters.js');
let products = require('./routes/productrouter.js');
let banners = require('./routes/bannerrouter.js');
let footer = require('./routes/footerrouter.js');
let homepage = require('./routes/homepagerouters.js');
let auth = require('./routes/authrouters.js');
let locationtaxes = require('./routes/locationrouters.js');
let modelreviews = require('./routes/modelreviewrouter.js');
let validationRouter = require('./routes/validationrouters.js');
let blogs = require('./routes/blogsrouter');
let news = require('./routes/newsrouters');
let carrersJobs = require('./routes/careerrouter');

app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/enquiry',enquiryRouter);
app.use('/api/modelvarient',modelVarientRouter);
app.use('/api/products',products);
app.use('/api/banners',banners);
app.use('/api/footer',footer);
app.use('/api/homepage',homepage);
app.use('/api/auth',auth);
app.use('/api/locationtaxes',locationtaxes);
app.use('/api/reviews',modelreviews);
app.use('/api/validations',validationRouter);
app.use('/api/blogs',blogs);
app.use('/api/news',news);
app.use('/api/carrers',carrersJobs);

app.listen(8000, function (err) {
    console.log('server is running on port:8000');
})
//exports.nayagadiApi = functions.https.onRequest(app);







