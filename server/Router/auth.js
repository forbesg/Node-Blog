const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/UserModel');

passport.use(new LocalStrategy(
  function(email, password, done) {
    console.log('In local strategy', email, password);
    User.findOne({ email: email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log('Incorrect username.');
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        console.log('Incorrect password.');
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log(user);
      return done(null, user);
    });
  }
));

module.exports = passport;
