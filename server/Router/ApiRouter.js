const express = require('express');
const ApiRouter = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const image = require('../helpers/images');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('./models/UserModel');
const Post = require('./models/PostModel')

// Connect to MongoDB
mongoose.connect('mongodb://localhost/spectre');
mongoose.Promise = global.Promise; //Plugin global Promises
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Set details for image uploads - Public Directory needs Image && Image/Posts directories
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../../public/images/posts')
  },
  filename: function (req, file, cb) {
    let filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename)
  }
});
const upload = multer({
  storage
});


/****
  Routes under the /api path - called from
****/

ApiRouter.post('/users/register', jsonParser, (req, res) => {
  console.log(req.body);
  let user = new User(req.body);
  if (user) {
    user.save().then(err => {
      if (err) {
        console.log(err, 'Completes Save With Promise');
        return res.redirect('/')
      }
      res.send(200);
    })
  } else {
    console.log('We are here --- Why?');
  }
});

ApiRouter.post('/users/login', jsonParser, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email. password);
});

// Return posts belonging to the signed in user
ApiRouter.get('/users/:userId/posts', (req, res) => {
  console.log('User', req.params.userId);
  let query = Post.find({ 'author.id': req.params.userId });
  query.sort( {date: -1} );
  query.exec((err, posts) => {
    if (err) return console.log(err);
    res.status(200).send({posts});
  })
});

ApiRouter.get('/posts', (req, res) => {
  Post.find().sort( {date: -1} ).exec( (err, posts) => {
    if (err) return res.send({err});
    res.status(200).send({posts});
  });
});

ApiRouter.get('/posts/:postId', (req, res) => {
  Post.find().sort({date: -1}).limit(5).exec((err, posts) => {
    if (err) return res.send({err: err});
    const postId = req.params.postId;
    let otherPosts = posts.filter(post => {
      return post._id.toString() !== postId;
    });
    Post.findOne({ _id: req.params.postId }, (err, post) => {
      res.status(200).send({post, posts: otherPosts});
    });
  });
});

ApiRouter.get('/posts/edit/:postId', (req, res) => {
  Post.findOne({ _id: req.params.postId }, (err, post) => {

    if (!post) {
      res.redirect('/admin');
    }
    res.status(200).send({post});
  });
});


ApiRouter.post('/posts', upload.single('image'), (req, res) => {
  let postObject = req.body;
  postObject.image = req.file.filename;
  postObject.summary = `${postObject.content.substring(0, 96)} ....`;
  postObject.author = {
    name: req.user.first_name,
    email: req.user.email,
    id: req.user._id
  }

  image.resize(postObject.image);

  let post = new Post(postObject);

  if (post) {
    post.save().then((post) => {
      return res.status(200).redirect('/posts');
    }).catch(err => {
      console.log(err, 'Error while saving post');
      res.status(500).redirect('/posts');
    })
  } else {
    console.log('There was an error - No Post object');
    res.status(500).redirect('/posts');
  }
});

ApiRouter.post('/posts/:postId', upload.single('image'), (req, res) => {
  if (!req.user) return res.redirect('/')
  let updatePost = {
    title: req.body.title,
    date: req.body.date,
    content: req.body.content,
    summary: `${req.body.content.substring(0, 96)} ....`
  }
  if (req.file) {
    updatePost.image = req.file.filename;
    image.resize(updatePost.image);
    if (req.body.currentImage) {
      image.delete(req.body.currentImage);
    }
  }
  Post.update({ _id: req.params.postId, 'author.id': req.user._id }, {
    $set: updatePost
  }, (err, post) => {
    if (err) {
      console.log(err);
      return res.status(401).redirect('/admin');
    }
    res.status(200).redirect('/admin');
  });
});

ApiRouter.delete('/posts/:postId', (req, res) => {
  Post.findById(req.params.postId, (err, post) => {
    if (post && post.image) {
      image.delete(post.image);
    }
  }).then(() => {
    Post.findById(req.params.postId).remove((err) => {
      if (err) return res.status(500).send({err});
      res.status(200).send({success: true});
    })
  });
});

ApiRouter.get('/test', (req, res) => {
  res.send({testing: true});
});

ApiRouter.get('/test/:id', (req, res) => {
  res.send({testing: req.params.id});
});

module.exports = ApiRouter;
