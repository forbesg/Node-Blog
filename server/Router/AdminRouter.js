const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const auth = require('./auth');
const md = require('markdown').markdown;
const Post = require('./models/PostModel');

module.exports = (app, passport) => {
    /*****
    Admin (protected Routes from index.js)
    *****/

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

    .get('/admin/logout', (req, res) => {
      req.logout();
      res.redirect('/admin');
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
