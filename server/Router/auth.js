const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleConfig = require('../config/config').googleConfig;
const User = require('./models/UserModel');



passport.serializeUser(function(user, done) {
  console.log('Serialize User', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('deserialize', user);
  User.findById(user._id, function(err, user) {
    done(err, user);
  });
});


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
      if (user.provider) {
        return done(null, false, { message: 'Email Registered with Social Sign-In' })
      }
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
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ provider: 'google', email: profile.emails[0].value }).exec().then(user => {
      if (!user) {
        let newUser = {
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          email: profile.emails[0].value,
          password: 'google',
          provider: profile.provider,
          profilePicture: profile.photos[0].value,
          posts: []
        };
        user = new User(newUser);
        user.save().then(user => {
          done(null, user);
        }).catch(err => {
          done(err, false)
        });
      } else {
        done(null, user);
      }
    }).catch(err => {
      console.log(err);
      done(err, false)
    });
  }
));

module.exports = passport;
