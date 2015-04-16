var db = require('../models');
var express = require('express');
var router = express.Router();
var passport = require('passport');



//POST /auth/signup
//create new user in database
router.post('/',function(req,res){
    //do sign up here (add user to database)
console.log("hello")
    db.user.find({where: {email: req.session.x}}).then(function(data){

      // data = data.map(function(u) { return u.email});
      req.flash('success','Your message was sent!');
      res.render('main/restricted');
      console.log("the data "+data.id)
      console.log(req.session.x)
    });

    // res.redirect('/');
});



module.exports = router;