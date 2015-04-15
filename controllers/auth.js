var db = require('../models');
var express = require('express');
var router = express.Router();
var passport = require('passport');

//GET /auth/login
//display login form
router.get('/login',function(req,res){
    res.render('auth/login');
});

//POST /login
//process login data and login user
router.post('/login',function(req,res){
    //do login here (check password and set session value)
    passport.authenticate('local',function(err,user,info){
      if(user){
        req.login(user,function(err){
          if(err) throw err;
          req.flash('success','You are now logged in.');
          res.redirect('/');
        })
      }else{
        var errorMsg = info && info.message ? info.message : 'Unknown error.';
        req.flash('danger',errorMsg);
        res.redirect('/auth/login');

      }
    })(req,res);
    //user is logged in forward them to the home page
    // res.redirect('/');
});

//GET /auth/signup
//display sign up form
router.get('/signup',function(req,res){
    res.render('auth/signup');
});

//POST /auth/signup
//create new user in database
router.post('/signup',function(req,res){
    //do sign up here (add user to database)

    //user is signed up forward them to the home page
    res.redirect('/');
});

//GET /auth/logout
//logout logged in user
router.get('/logout',function(req,res){
    req.logout();
    req.flash('info','You have been logged out.')
    res.redirect('/');
});

var ALLOWED_PROVIDERS = ['facebook'];

//oAuth login route
router.get('/login/:provider',function(req,res) {
  passport.authenticate(
    req.params.provider,
    {scope:['public_profile','email']}
  )(req,res);
})

//oAuth callback route
router.get('/callback/:provider',function(req,res){
  if (ALLOWED_PROVIDERS.indexOf(req.params.provider) === -1){
    return res.send('invalid profider url.');
  }
      passport.authenticate(req.params.provider, function(err,user,info){
      if(user){
        console.log("FOUDN USER", user);
        req.login(user,function(err){
          if(err) throw err;
          req.flash('success','You are now logged in.');
          // res.redirect('/');
        })
        res.redirect('/');
      }else{
        var errorMsg = info && info.message ? info.message : 'Unknown error.';
        req.flash('danger',errorMsg);
        res.redirect('/auth/login');

      }
    })(req,res);
});


module.exports = router;