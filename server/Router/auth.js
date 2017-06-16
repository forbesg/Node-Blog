const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook');
const config = require('../config/config');
const User = require('./models/UserModel');


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
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
passport.use(new GoogleStrategy(config.google,
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ email: profile.emails[0].value }).exec().then(user => {
      // Check that email is not already registered
      if (user && user.provider !== 'google') {
        return done(null, false, {message: "Email is already registered using a different service."});
      }
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

/*****
  PASSPORT FACEBOOK STRATEGY
*****/
passport.use(new FacebookStrategy(config.facebook,
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({ email: profile.emails[0].value }).exec().then(user => {
      // Check that email is not already registered
      if (user && user.provider !== 'facebook') {
        return done(null, false, {message: "Email is already registered using a different service."});
      }

      // If no user - create new user
      if (!user) {
        let newUser = {
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          email: profile.emails[0].value,
          password: 'facebook', // Not used as redirects social logins in local strategy
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
      }
      // If User is found pass user through
      else {
        done(null, user);
      }
    }).catch(err => {
      console.log(err);
      done(err, false)
    });
  }
));

module.exports = passport;
