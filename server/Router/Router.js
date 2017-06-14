const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const md = require('markdown').markdown;
const Post = require('./models/PostModel');


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
    let message = req.flash('message')[0];
    Post.find({}).limit(6).sort({date: -1}).exec().then(posts => {
      res.render('blog', {
        title,
        posts,
        md,
        user: req.user,
        message
      })
    }).catch(err => {
      console.log('Error receivng Posts');
      res.status(500).redirect('/posts');
    });
  })

  .get('/posts/:postSlug', (req, res) => {
    Post.findOne({ slug: req.params.postSlug }).exec().then(post => {
      let params = {
        title: post.title,
        post,
        md,
        user: req.user
      }
      Post.find({}).limit(5).sort({date: -1}).exec().then(posts => {
        // Omit the current post from the sidebar
        params.posts = posts.filter(p => {
          return p._id.toString() !== post._id.toString();
        });
        return res.render('post', params);
      }).catch(err => {
        console.log(err);
        return res.status(500).redirect('/posts');
      })
    }).catch(err => {
      console.log('Error', err.name); //How to Best handle Mongoose Errors??
      req.flash('message', 'No Post Found with that ID');
      res.status(500).redirect('/posts');
    });
  })


  /****
    Login & Register
  ****/

  .get('/login', (req, res) => {
    let message = req.flash('error')[0];
    let title = 'Login';
    let params = {
      login: true,
      message
    };
    if (req.user) {
      params.user = req.user
    }
    res.render('page', params);
  })

  .get('/register', (req, res) => {
    let title = 'Login';
    let params = {
      register: true
    }
    if (req.user) {
      return res.redirect('/admin/dashboard');
    }
    res.render('page', params);
  })


  /*****
  Catch All Not Found
  *****/

  .get('/*', (req, res) => {
    let title = 'Page Not Found';
    res.render('page', {title});
  });

}
