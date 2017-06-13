const bodyParser = require('body-parser');
const request = require('request');
const port = process.env.PORT || 3000;
const md = require('markdown').markdown;


module.exports = (app, passport) => {

  app.get('/', (req, res) => {
    res.render('index', {
      title: "My Other title",
      feature: {
        image: 'https://unsplash.it/1200/900?image=1059'
      },
      user: req.user
    });
  })

  .get('/about', (req, res) => {
    let title = req.params.title;
    let body = {
      head: "My Page Heading",
      author: "Forbes Gray",
      date: Date().now
    }
    res.render('page', {
      title: 'About',
      feature: {
        image: 'https://unsplash.it/1200/800/'
      },
      user: req.user,
      body: JSON.stringify(body)
    });
  })

  .get('/posts', (req, res) => {
    let title = 'Blog';
    request.get(`http://localhost:${port}/api/posts`, (err, response, body) => {
      if (err) return res.status(500).json({err});
      res.render('blog', {
        title,
        posts: JSON.parse(body).posts,
        md,
        user: req.user
      })
    })
  })

  .get('/posts/:postId', (req, res) => {
    request.get(`http://localhost:${port}/api/posts/${req.params.postId}`, (err, response, body) => {
      if (err) return res.status(500).json({err});
      let bodyObject = JSON.parse(body);
      if (!bodyObject.post) return res.status(404).redirect('/not-found');
      res.render('post', {
        title: bodyObject.post.title,
        post: bodyObject.post,
        posts: bodyObject.posts,
        user: req.user,
        md
      });
    })
  })


  /****
    Login & Register
  ****/

  .get('/login', (req, res) => {
    let title = 'Login';
    let params = {
      title: 'Login',
      login: true
    };
    if (req.user) {
      params.user = req.user
    }
    res.render('page', params);
  })

  .get('/register', (req, res) => {
    let title = 'Login';
    let params = {
      title: 'Register',
      register: true
    }
    if (req.user) {
      return res.redirect('/admin/dashboard');
    }
    res.render('page', params);
  })
  .post('/register', bodyParser.urlencoded({extended: false}), (req, res, next) => {
    console.log(req.body);
    let options = {
      method: 'post',
      body: req.body,
      json: true,
      url: `http://localhost:${port}/api/users/register`
    };
    request(options, (err, response, body) => {
      if (err) return res.status(500).json({err});
      next();
    })
  }, passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/',
    // failureFlash: true
  }))


  /*****
  Admin (protected Routes)
  *****/

  // .get('/admin', (req, res) => {
  //   console.log(res.locals);
  //   res.redirect('/admin/dashboard');
  // })
  //
  // .post('/admin', bodyParser.urlencoded({extended: false}), passport.authenticate('local', {
  //   successRedirect: '/admin/dashboard',
  //   failureRedirect: '/',
  //   // failureFlash: true
  // }))
  //
  // .get('/admin/logout', (req, res) => {
  //   req.logout();
  //   res.redirect('/admin');
  // })
  //
  // .get('/admin/dashboard', (req, res) => {
  //   let params = {
  //     title: 'Dashboard',
  //     dashboard: true,
  //     user: req.user
  //   };
  //   request.get(`http://localhost:${port}/api/posts/`, (err, response, body) => {
  //     if (err) return res.status(500).json({err});
  //     params.posts = JSON.parse(body).posts;
  //     res.render('page', params);
  //   });
  // })
  //
  // .get('/admin/post/add', (req, res) => {
  //   let title = "Add";
  //   res.render('page', {title, add: true, md});
  // })
  //
  // .get('/admin/post/edit/:postId', (req, res) => {
  //   let title = "Edit";
  //   request.get(`http://localhost:${port}/api/posts/${req.params.postId}`, (err, response, body) => {
  //     if (err) return res.status(500).json({err})
  //     let post = JSON.parse(body).post;
  //     post.date = post.date.split('T')[0];
  //     res.render('page', {title, edit: true, post, md});
  //   });
  // })
  //
  // .get('/admin/post/delete/:postId', (req, res) => {
  //   request.delete(`http://localhost:${port}/api/posts/${req.params.postId}`, (err, response, body) => {
  //     if (err) return res.status(500).json({err})
  //     res.redirect('/admin');
  //   });
  // })

  /*****
  Catch All Not Found
  *****/

  .get('/*', (req, res) => {
    let title = 'Page Not Found';
    res.render('page', {title});
  });

}
