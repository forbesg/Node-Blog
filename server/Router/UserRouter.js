const User = require('./models/UserModel');
const bodyParser = require('body-parser');

const checkAuth = function (req, res, next) {
  if (!req.user) {
    req.flash('error', 'You have to be logged in to view users');
    return res.redirect('/login');
  }
  next();
};

// Send 401 Unauthorized if user not Admin
const checkAdmin = function (req, res, next) {
  if (!req.user.admin) {
    req.flash('message', 'You need to be an Admin to view all users');
    return res.status(401).redirect(`/users/${req.user._id}`);
  }
  next();
}

module.exports = (app, passport) => {
  app.all('/users*', checkAuth);

  /****
  Register New User
  ****/
  app.post('/register', bodyParser.urlencoded({extended: false}), (req, res, next) => {
    let newUser = req.body;
    newUser.profilePicture = '/images/users/default/photo.png';
    newUser.provider = 'local';
    let user = new User(newUser);
    if (user) {
      user.save().then(user => {
        if (user) next();
      }).catch(err => {
        // Check for duplicate code 11000 & add flash message if it is
        if (err.code === 11000) {
          req.flash('error', 'This email is already registered');
        }
        return res.redirect('/register')
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
  app.get('/users', checkAdmin, (req, res) => {
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


  // POST Request to set user as admin
  app.post('/users/:userId/admin', checkAdmin, bodyParser.json(), (req, res) => {
    User.update({_id: req.params.userId}, {$set: { admin: req.body.admin }}).then(data => {
      res.sendStatus(200);
    }).catch(err => {
      res.sendStatus(500);
    })
  })

  app.get('/users/:userId', (req, res) => {
    let message = req.flash('message')[0];
    User.findOne({_id: req.params.userId}, (err, user) => {
      if (user) {
        let params = {
          user: req.user,
          thisUser: user,
          message
        };
        if (user._id.toString() === req.user._id.toString()) {
          params.currentUser = true;
        }
        return res.render('user', params);
      }
      res.redirect('/')
    })
  })


}
