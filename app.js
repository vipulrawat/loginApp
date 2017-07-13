var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require('express-handlebars');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

//Setting up the database
mongoose.connect('mongodb://localhost/ownloginapp',{useMongoClient:true});
var db = mongoose.connection;

//Setting express
var app = express();
//Setting the bodyParser
app.use(bodyParser.urlencoded({extended:false}));
//Setting up the view engine
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');
//Setting up the static files
app.use('/assets',express.static('assets'));
//Setting up the routes
var routes = require('./routes/index');
var users = require('./routes/users');
// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Setting passport
app.use(passport.initialize());
app.use(passport.session());

//Setting up the routes
app.use('/',routes);
app.use('/users',users);



app.listen(3001,'localhost');
console.log('Listening to default');