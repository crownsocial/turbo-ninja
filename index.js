var db = require('./models');
var express = require('express');
var bodyParser = require('body-parser');
// NEW stuff for Oauth
var session = require('express-session')
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var NODE_ENV = process.env.NODE_ENV || 'development';
var BASE_URL = (NODE_ENV === 'production') ? 'https://memail.herokuapps.com' : 'http://localhost:3000';



// Passport
passport.serializeUser(function(user,done) {
  done(null, user.id);
});

passport.deserializeUser(function(id,done) {
  db.user.find(id).then(function(user) {
    done(null,user.get());
  }).catch(done);
});

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: BASE_URL+'/auth/callback/facebook'
},function(accessToken, refreshToken, profile, done) {
  db.provider.find({
    where:{
      pid:profile.id,
      type:profile.provider
    },
    include:[db.user]
  }).then(function(provider){
    if(provider && provider.user){
      // login
      provider.token = accessToken;
      provider.save().then(function(){
        done(null,provider.user.get());
      });

    }else{
      // signup
      var email = profile.emails[0].value;
      db.user.findOrCreate({
        where:{email:email},
        defaults:{email:email,name:profile.displayName}
      }).spread(function(user, created){
        if(created){
          // user was created
          user.createProvider({
            pid: profile.id,
            token: accessToken,
            type: profile.provider
          }).then(function(){
            done(null,user.get());
          })
        }else{
          //signup failed
          done(null,false,{message:'You already signed up with this email address. Please login.'})
        }
      })
    }
  })
}));

passport.use(new LocalStrategy({
  usernameField: 'email'
},
function(email, password, done) {
  db.user.find({where:{email:email}}).then(function(user) {
    if(user){
      user.checkPassword(password,function(err,result) {
        if(err) return done(err);
        if (result){
          done(null, user.get());
        }else{
          done(null,false,{message:'Invalid password.'})
        }
      })
    }else{
      done(null,false,{message:'Unknown user. Please sign up.'});
    }
  })
}));

//configure express
var app = express();
app.set('view engine','ejs');

//load middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//custom middleware to pass through alerts
app.use(function(req,res,next) {
  res.locals.alerts=req.flash();
  next();
})

//custom middleware - is user logged in
app.use(function(req,res,next){
  req.getUser = function(){
    return req.session.user || false;
  }

  //trigger next middleware
  next();
});

//load routes
app.use('/',require('./controllers/main.js'));
app.use('/auth',require('./controllers/auth.js'));
app.use('/email',require('./controllers/email.js'));

//listen for connections
app.listen(process.env.PORT || 3000);
console.log("Server on 3000 bish!");