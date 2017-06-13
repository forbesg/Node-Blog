const bodyParser = require('body-parser');
const request = require('request');
const port = process.env.PORT || 3000;
const auth = require('./auth');

const checkAuth = function (req, res, next) {
  if (!req.user) return res.redirect('/login');
  next();
}

module.exports = (app, passport) => {
    /*****
    Admin (protected Routes)
    *****/
    app.all('/admin/*', checkAuth)
    .get('/admin', (req, res) => {
      console.log(app.locals);
      res.redirect('/admin/dashboard');
    })

    .post('/admin', bodyParser.urlencoded({extended: false}), passport.authenticate('local', {
      successRedirect: '/admin/dashboard',
      failureRedirect: '/',
      // failureFlash: true
    }))

    .get('/admin/logout', (req, res) => {
      req.logout();
      res.redirect('/admin');
    })

    .get('/admin/dashboard', (req, res) => {
      let params = {
        title: 'Dashboard',
        dashboard: true,
        user: req.user
      };
      request.get(`http://localhost:${port}/api/posts/`, (err, response, body) => {
        if (err) return res.status(500).json({err});
        params.posts = JSON.parse(body).posts;
        res.render('page', params);
      });
    })

    .get('/admin/post/add', (req, res) => {
      let title = "Add";
      res.render('page', {title, add: true, md});
    })

    .get('/admin/post/edit/:postId', (req, res) => {
      let title = "Edit";
      request.get(`http://localhost:${port}/api/posts/${req.params.postId}`, (err, response, body) => {
        if (err) return res.status(500).json({err})
        let post = JSON.parse(body).post;
        post.date = post.date.split('T')[0];
        res.render('page', {title, edit: true, post, md});
      });
    })

    .get('/admin/post/delete/:postId', (req, res) => {
      request.delete(`http://localhost:${port}/api/posts/${req.params.postId}`, (err, response, body) => {
        if (err) return res.status(500).json({err})
        res.redirect('/admin');
      });
    })
}
