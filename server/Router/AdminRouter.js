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
    .post('/admin', bodyParser.urlencoded({extended: false}), passport.authenticate('local', {
      successRedirect: '/admin/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    }))

    .get('/auth/google', (req, res, next) => {
      console.log('trying');
      next();
    }, passport.authenticate('google', {
      scope: ['profile']
    }))

    .get('/auth/google/callback', passport.authenticate('google', {
      failureRedirect: '/'
    }), (req, res) => {
      console.log('Successfully Logged In with Google');
      res.redirect('/admin/dashboard')
    })

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
