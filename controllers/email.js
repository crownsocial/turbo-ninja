var db = require('../models');
var express = require('express');
var router = express.Router();
var passport = require('passport');

//sendgrid stuff
var sendgrid  = require('sendgrid')(process.env.SENDGRID_API_USER, process.env.SENDGRID_API_KEY);
var to = process.env.TO;
var email = new sendgrid.Email();


//POST /auth/signup
//create new user in database
router.post('/',function(req,res){
    //do sign up here (add user to database)
console.log("hello")
    db.user.find({where: {email: req.session.x}}).then(function(data){
      db.email.create({ userId: data.id, content: req.body.content}).then(function(data) {
      // data = data.map(function(u) { return u.email});

      //sendgrid
var email = new sendgrid.Email();
email.addTo(to);
email.setFrom(to);
email.setSubject('[MeMail] to '+req.session.x);
email.setText(req.body.content);
email.setHtml('<h1 style=\"background-color:#000;color:#fff\">An important message from you:</h1><br><br><strong><font size=20>%how%</font> <br><br><br><br><br><br><br><br><br><br><br></strong>---------------------------------------------------------------------- ////////<strong><h1>Btw you\'re awesome for using</h1><font size=20 style=\"background-color:#f20d63;color:#fff\">MeMail&trade;</font></strong><br><a style=\"background-color:#00faf7;color:blue\" href=http://memail.herokuapp.com>http://memail.com</a><br><br><br><br>');
email.addSubstitution("%how%", req.body.content);
email.addHeader('X-Sent-Using', 'SendGrid-API');
email.addHeader('X-Transport', 'web');
email.addFile({path: __dirname+'/../public/images/we_logo_bk.png', filename: 'just a fun image to surprise and delight yourself because you\'re such a kingpin.jpg'});

sendgrid.send(email, function(err, json) {
  if (err) { return console.error(err); }
  console.log(json);
});

      //end sendgrid
      req.flash('boom','Your message was sent!');
      res.render('main/restricted');
      console.log("the data "+data.id)
      console.log(req.session.x)
    });
    });

    // res.redirect('/');
});



module.exports = router;