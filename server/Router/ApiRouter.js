const express = require('express');
const ApiRouter = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

mongoose.connect('mongodb://localhost/spectre');
let postSchema = mongoose.Schema({
  title: String,
  slug: String,
  date: Date,
  content: String,
  image: String
});

let Post = mongoose.model('post', postSchema);


const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
console.log(__dirname + '/../../client/images/posts');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../../client/images/posts')
  },
  filename: function (req, file, cb) {
    console.log(file.originalname);
    cb(null, file.originalname)
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
  console.log(req.body, req.file);
  postObject = req.body;
  postObject.image = req.file.originalname
  let post = new Post(req.body);
  if (post) {
    post.save((err, post) => {
      if (err) return res.send({err});
      console.log('Added ' + post.title);
      return res.status(200).redirect('/');
    })
  } else {
    console.log('There was an error');
    res.status(500).redirect('/');
  }
})
ApiRouter.get('/test', (req, res) => {
  res.send({testing: true});
});
ApiRouter.get('/test/:id', (req, res) => {
  res.send({testing: req.params.id});
});

module.exports = ApiRouter;
