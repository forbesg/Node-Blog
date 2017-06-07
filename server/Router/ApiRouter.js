const express = require('express');
const ApiRouter = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const moment= require('moment');
const fs = require('fs');
const sharp = require('sharp');

mongoose.connect('mongodb://localhost/spectre');
let postSchema = mongoose.Schema({
  title: String,
  slug: String,
  date: String,
  content: String,
  summary: String,
  image: String
});

let Post = mongoose.model('post', postSchema);


const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../../client/images/posts')
  },
  filename: function (req, file, cb) {
    let filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename)
  }
});
const upload = multer({
  storage
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

ApiRouter.get('/posts', (req, res) => {
  Post.find().sort( {date: -1} ).exec( (err, posts) => {
    if (err) return res.send({err});
    console.log(posts)
    res.status(200).send({posts});
  });
});

ApiRouter.get('/posts/:postId', (req, res) => {
  Post.find((err, posts) => {
    if (err || posts.length < 1) return res.send({err});
    const postId = req.params.postId;
    let otherPosts = posts.filter(post => {
      return post._id.toString() !== postId;
    });
    let post = posts.filter(p => {
      return p._id.toString() === postId
    })[0]
    res.status(200).send({post, posts: otherPosts});
  });
});

ApiRouter.post('/posts', upload.single('image'), (req, res) => {
  let postObject = req.body;
  console.log(req.file);
  postObject.image = req.file.filename;
  postObject.summary = postObject.content.substring(0, 100);
  console.log(postObject);
  let originalImagePath = __dirname + '/../../client/images/posts/' + postObject.image;
  let imagePath = __dirname + '/../../client/images/posts/scaled_' + postObject.image;
  let thumbPath = __dirname + '/../../client/images/posts/thumbs/' + postObject.image;
  console.log(imagePath, thumbPath);
  sharp(originalImagePath).resize(1200, 675).toFile(imagePath, function(err) {
     if (err) {
       throw err;
     }
     sharp(imagePath).resize(300, 200).toFile(thumbPath, function(err) {
        if (err) {
          throw err;
        }
     });
  });

  let post = new Post(postObject);

  if (post) {
    post.save((err, post) => {
      if (err) return res.send({err});
      return res.status(200).redirect('/posts');
    })
  } else {
    console.log('There was an error');
    res.status(500).redirect('/posts');
  }
});

ApiRouter.post('/posts/:postId', upload.single('image'), (req, res) => {
  console.log('Here', req.params.postId, req.body);
  Post.update({ _id: req.params.postId }, {
    $set: {
      title: req.body.title,
      date: req.body.date,
      content: req.body.content,
      summary: req.body.content.substring(0, 100)
    }
  }, (err, post) => {
    if (err) console.log(err);
    console.log(post);
    res.status(200).redirect('/admin');
  });
});

ApiRouter.delete('/posts/:postId', (req, res) => {
  Post.findById(req.params.postId, (err, post) => {
    if (post && post.image) {
      const originalImagePath = `${__dirname}/../../client/images/posts/${post.image}`;
      const imagePath = `${__dirname}/../../client/images/posts/scaled_${post.image}`;
      const thumbPath = `${__dirname}/../../client/images/posts/thumbs/${post.image}`;
      fs.unlink(originalImagePath, (err) => {
        if (err) console.log(err);
        console.log('Original Image Deleted');
      });
      fs.unlink(imagePath, (err) => {
        if (err) console.log(err);
        console.log('Image Deleted');
      });
      fs.unlink(thumbPath, (err) => {
        if (err) console.log(err);
        console.log('Thumbnail Deleted');
      });
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
