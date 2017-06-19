const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const auth = require('./auth');
const md = require('markdown').markdown;
const Post = require('./models/PostModel');

module.exports = (app, passport) => {
    /*****
    Admin (protected Routes)
    *****/

    // Check User is authenticated when accessin Admin routes
    const checkAuth = function (req, res, next) {
      if (!req.user) return res.redirect('/login');
      next();
    }
    app.all('/admin/*', checkAuth)

    app.get('/admin', (req, res) => {
      res.redirect('/admin/dashboard');
    })

    /*****
    Login / Logout
    *****/

    // Local
    .post('/admin', bodyParser.urlencoded({extended: false}), passport.authenticate('local', {
      successRedirect: '/admin/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    }))

    // Google
    .get('/auth/google', passport.authenticate('google', {
      scope: ['profile', 'email']
    }))

    .get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/admin/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    }))

    // Facebook
    .get('/auth/facebook', passport.authenticate('facebook'))

    .get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect: '/admin/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    }))

    // Twitter
    .get('/auth/twitter', passport.authenticate('twitter'))

    .get('/auth/twitter/callback', passport.authenticate('twitter', {
      failureRedirect: '/login',
      failureFlash: true
    }), (req, res) => {
      console.log('twitter');
      res.redirect('/admin/dashboard')
    })


    // Logout
    .get('/admin/logout', (req, res) => {
      req.logout();
      res.redirect('/login');
    })


    /*****
    Load Logged in Users Posts and render Dashboard
    *****/
    .get('/admin/dashboard', (req, res) => {
      let params = {
        title: 'Dashboard',
        dashboard: true,
        user: req.user
      };
      Post.find({ 'author._id': req.user._id }).then((posts) => {
        params.posts = posts;
        res.render('page', params);
      }).catch(err => {
        console.log(err);
        res.redirect('/admin')
      })
    })

    /*****
    Import Post Routes
    *****/
    require('./PostRouter')(app, passport)


}
