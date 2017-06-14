const User = require('./models/UserModel');
const bodyParser = require('body-parser');

const checkAuth = function (req, res, next) {
  if (!req.user) {
    req.flash('error', 'You have to be logged in to view users');
    return res.redirect('/login');
  }
  next();
}

module.exports = (app, passport) => {
  app.all('/users', checkAuth);

  /****
  Register New User
  ****/
  app.post('/register', bodyParser.urlencoded({extended: false}), (req, res, next) => {
    console.log(req.body);
    let user = new User(req.body);
    if (user) {
      user.save().then(user => {
        if (user) next();
      }).catch(err => {
        console.log(err, 'Error registering user');
        return res.redirect('/')
      })
    } else {
      console.log('We are here --- Why?');
    }
  }, passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/register',
    failureFlash: true
  }))

  /*****
  User Routes
  *****/
  app.get('/users', (req, res) => {
    User.find({}, (err, users) => {
      if (users) {
        return res.render('user', {
          user: req.user,
          users
        })
      }
      res.redirect('/')
    })
  })


  app.get('/users/:userId', (req, res) => {
    User.findOne({_id: req.params.userId}, (err, user) => {
      if (user) {
        return res.render('user', {
          user: req.user,
          thisUser: user
        })
      }
      res.redirect('/')
    })
  })


}
