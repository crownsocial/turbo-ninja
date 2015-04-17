var db = require('../models');
var express = require('express');
var router = express.Router();

//GET /
//home page of site
router.get('/',function(req,res){
    res.render('main/index',{user:'NEED USER NAME!!!'});
});

//GET /restricted
//an example restricted page
router.get('/restricted',function(req,res){
    if(req.isAuthenticated()){
    res.render('main/restricted');
  }else{
    req.flash('boom','You must be logged in to access that page');
    res.redirect('/');
  }
});


module.exports = router;