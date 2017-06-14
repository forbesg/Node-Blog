const bodyParser = require('body-parser');
const request = require('request');
const port = process.env.PORT || 3000;
const auth = require('./auth');
const md = require('markdown').markdown;
const Post = require('./models/PostModel');

const checkAuth = function (req, res, next) {
  if (!req.user) return res.redirect('/login');
  next();
}

module.exports = (app, passport) => {
    /*****
    Admin (protected Routes)
    *****/

    // Check User is authenticated
    app.all('/admin/*', checkAuth)

    .get('/admin', (req, res) => {
      res.redirect('/admin/dashboard');
    })

    // Login
    .post('/admin', bodyParser.urlencoded({extended: false}), passport.authenticate('local', {
      successRedirect: '/admin/dashboard',
      failureRedirect: '/login',
      failureFlash: true
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
      // request.get(`http://localhost:${port}/api/users/${req.user._id}/posts/`, (err, response, body) => {
      //   if (err) return res.status(500).json({err});
      //   params.posts = JSON.parse(body).posts;
      //   res.render('page', params);
      // });
      Post.find({ 'author._id': req.user._id }).then((posts) => {
        console.log(posts);
        params.posts = posts;
        res.render('page', params);
      }).catch(err => {
        console.log(err);
        res.redirect('/admin')
      })
    })

    .get('/admin/post/add', (req, res) => {
      let title = "Add";
      res.render('page', {title, add: true, md});
    })



/************

  NEED TO PROTECT EDIT AND DELETE ROUTES FROM NON OWNERS

************/
    .get('/admin/post/edit/:postId', (req, res) => {
      let title = "Edit";
      Post.findOne({ _id: req.params.postId }, (err, post) => {
        console.log(post);
        if (!post) {
          return res.status(404).redirect('/admin');
        }
        /**
        Return if current user is not the author of the post
        **/
        if (req.user._id.toString() !== post.author._id) {
          console.log('no _id match', typeof(req.user._id), typeof(post.author._id));
          return res.status(401).redirect('/admin');
        }
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
