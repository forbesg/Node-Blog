const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const md = require('markdown').markdown;
const Post = require('./models/PostModel');
const request = require('request');


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

  // .get('/posts/blogger', (req, res) => {
  //   request('https://www.googleapis.com/blogger/v3/blogs/9130771741256476266/posts?key=AIzaSyD237AD1Ity10xOxxhHDSmq1HN1CN_Fm5Y', (err, response, body) => {
  //     console.log(response, body);
  //     res.send(body)
  //     res.render('blog', {
  //       posts: JSON.parse(body).items
  //     })
  //   })
  // })

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
    if (req.user) {
      return res.redirect('/admin/dashboard')
    }
    let message = req.flash('error')[0];
    let title = 'Login';
    let params = {
      login: true,
      message
    };
    res.render('page', params);
  })

  .get('/register', (req, res) => {
    // redirect to dashboard id user is logged in
    if (req.user) {
      return res.redirect('/admin/dashboard');
    }
    let params = {
      title: 'Register',
      register: true,
      message: req.flash('error')[0]
    };

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
