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
          req.flash('boom','You are now logged in.');
          req.session.x = req.body.email;
          console.log(req.session.x);
          res.redirect('/restricted');
        })
      }else{
        var errorMsg = info && info.message ? info.message : 'Unknown error.';
        req.flash('boom',errorMsg);
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

    db.user.find({where: {email: req.body.email}}).then(function(data){
      // data = data.map(function(u) { return u.email});
      if(typeof data === 'undefined'){
        //already in database; please log in
        console.log("this is firing")
      }else{
        //register in database
        db.user.create({
          email: req.body.email,
          name: req.body.name,
          password: req.body.password
        })
      }
    });
// .catch(function(error) {
//   console.log("something happened");
//   console.log(error);
// })
    //user is signed up forward them to the home page
    req.flash('boom','You registered '+req.body.email)
    res.redirect('/');
});

//GET /auth/logout
//logout logged in user
router.get('/logout',function(req,res){
    req.logout();
    req.flash('boom','You have been logged out.')
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
    return res.send('invalid provider url.');
  }
      passport.authenticate(req.params.provider, function(err,user,info){
      if(user){
        console.log("FOUDN USER", user);
        req.session.x = user.email;
        req.login(user,function(err){
          if(err) throw err;
          req.flash('boom','You are now logged in.');
          // res.redirect('/');
        })
        res.redirect('/restricted');
      }else{
        var errorMsg = info && info.message ? info.message : 'Unknown error.';
        req.flash('boom',errorMsg);
        res.redirect('/auth/login');

      }
    })(req,res);
});


module.exports = router;