const User = require('./models/UserModel');
const checkAuth = function (req, res, next) {
  if (!req.user) return res.redirect('/login');
  next();
}

module.exports = (app, passport) => {
  app.all('/users/*', checkAuth);

  /*****
  User Routes
  *****/
  app.get('/users', (req, res) => {
    User.find({}, (err, users) => {
      if (users) {
        console.log(users);
        return res.render('user', {
          users
        })
      }
      res.redirect('/')
    })
  })
  app.get('/users/:userId', (req, res) => {
    User.findOne({_id: req.params.userId}, (err, user) => {
      if (user) {
        console.log(user);
        return res.render('user', {
          user
        })
      }
      res.redirect('/')
    })
  })
}
