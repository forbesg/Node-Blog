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
  Post.find((err, posts) => {
    if (err) return res.send({err});
    res.status(200).send({posts});
  });
});

ApiRouter.get('/posts/:postId', (req, res) => {
  Post.findById(req.params.postId, (err, post) => {
    if (err) return res.send({err});
    res.status(200).send({post});
  });
});

ApiRouter.post('/posts', upload.single('image'), (req, res) => {
  let postObject = req.body;
  console.log(req.file);
  postObject.image = req.file.filename;
  console.log(postObject);
  let imagePath = __dirname + '/../../client/images/posts/' + postObject.image;
  let thumbPath = __dirname + '/../../client/images/posts/thumbs/' + postObject.image;
  console.log(imagePath, thumbPath);
  sharp(imagePath).resize(300, 200).toFile(thumbPath, function(err) {
     if (err) {
       throw err;
     }
  });

  let post = new Post(req.body);
  if (post) {
    post.save((err, post) => {
      if (err) return res.send({err});
      return res.status(200).redirect('/');
    })
  } else {
    console.log('There was an error');
    res.status(500).redirect('/');
  }
})

ApiRouter.delete('/posts/:postId', (req, res) => {
  Post.findById(req.params.postId, (err, post) => {
    if (post && post.image) {
      const imagePath = `${__dirname}/../../client/images/posts/${post.image}`;
      const thumbPath = `${__dirname}/../../client/images/posts/thumbs/${post.image}`;
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
