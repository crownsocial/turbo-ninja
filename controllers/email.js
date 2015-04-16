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
email.setHtml('Wait a minute...<br><br><strong>%how% <br><br><h1>wow cool okay</h1></strong>');
email.addSubstitution("%how%", req.body.content);
email.addHeader('X-Sent-Using', 'SendGrid-API');
email.addHeader('X-Transport', 'web');
// email.addFile({path: 'images/stalk-much.jpg', filename: 'stalk-much.jpg'});

sendgrid.send(email, function(err, json) {
  if (err) { return console.error(err); }
  console.log(json);
});

      //end sendgrid
      req.flash('success','Your message was sent!');
      res.render('main/restricted');
      console.log("the data "+data.id)
      console.log(req.session.x)
    });
    });

    // res.redirect('/');
});



module.exports = router;