var express = require('express');
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
//Get Login
router.get('/login',function(req,res){
    res.render('login');
});
//Get Register
router.get('/register',function(req,res){
    res.render('register');
});
//Post Register
router.post('/register',function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var isEquals = (password===password2);
    //checking passwords
    if(isEquals){
        var newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });
        //Creating User
        User.createUser(newUser,function(err,user){
            if(err) throw err;
            console.log(user);
        });
        //Redirect to login 
        res.redirect('/users/login');
    }else{
        res.render('register',{error_msg:'Password doesnt match'});
    }
});
//Passport local strategy
passport.use(new LocalStrategy(function(username,password,done){
  User.getUserByUsername(username,function(err,user){
    if(err) throw err;
    if (!user) {
      return done(null,false,{message:'Unknown user'});
    }
    User.comparePassword(password,user.password,function(err,isMatch){
      if(err) throw err;
      if (isMatch) {
        return done(null,user);
      }else {
        return done(null,false,{messsage:'Invalid Match'});
      }
    });
  });
}));
//Serialize and Deserialize User
passport.serializeUser(function(user,done){
     done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.getUserById(id,function(err,user){
         done(err,user);
    });
});
//Post login
router.post('/login',passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/register'}),
function(req,res){
    res.redirect('/');
});
//Logout
router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/users/login');
});
module.exports = router;