const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleConfig = require('../config/config').googleConfig;
const User = require('./models/UserModel');


/*****
  PASSPOSRT LOCAL STRATEGY
*****/
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log('Incorrect username.');
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (!user.isValidPassword(password)) {
        console.log('Incorrect password.');
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

/*****
  PASSPORT GOOGLE STRATEGY
*****/
passport.use(new GoogleStrategy(googleConfig,
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
