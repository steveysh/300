/*
author: wingkwong
*/

var express = require('express');
var app = express();
var fs = require('fs');
var session = require('express-session');
var path = require('path');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var morgan = require('morgan');
var ejs = require('ejs');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port = process.env.PORT || 10880;

var User  = require('./models/user');
var Event  = require('./models/event');
var Mail = require('./models/mail');

require('./config/passport')(passport);

/*
App Configuration
*/

app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  return next();
});

// EXPRESS
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));

app.set('view engine', 'ejs'); 
app.engine('ejs', require('ejs').renderFile);

//PASSPORT
app.use(session({
    secret: 'sepj201617',
    name: 'sepj',
    proxy: true,
    resave: true,
    saveUninitialized: true
})); 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); 

// ROUTE
require('./route')(app, passport, User, Event, Mail, fs); 

/*
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});


/*
	MongoDB
*/

//DEV
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://sepj:sepj201617@ds033056.mlab.com:33056/sepj');

//PRD
//mongoose.connect('mongodb://wingkwong:tplNPyl1FB@mongodb.cloudno.de:27017/sepj');

console.log("Connecting to MongoDB");

/*
	Use static folder web
*/
app.set('views', path.join(__dirname, 'web'));
app.use(express.static('web'));


app.use('/img', express.static('img'));
app.use('/profileImg', express.static('profileImg'));
//for demo only
app.use('/tmp', express.static('tmp'));


app.listen(port, function () {
  console.log('App is listening on port ' + port);
});