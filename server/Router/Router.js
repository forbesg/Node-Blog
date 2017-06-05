const express = require('express');
const Router = express.Router();
const request = require('request');

Router.get('/', (req, res) => {
  res.render('index', {
    title: "My Other title",
    feature: {
      image: 'https://unsplash.it/1600/1200?image=1059'
    }
  });
})

.get('/about', (req, res) => {
  let title = req.params.title;
  let body = {
    head: "My Page Heading",
    author: "Forbes Gray",
    date: Date().now
  }
  res.render('page', {title: 'About', body: JSON.stringify(body)});
})

.get('/posts', (req, res) => {
  let title = 'Blog';
  request.get('http://localhost:3000/api/posts', (err, response, body) => {
    if (err) return res.status(500).json({err});
    res.render('blog', {title, posts: JSON.parse(body).posts});
  })
})

.get('/posts/:postId', (req, res) => {
  request.get(`http://localhost:3000/api/posts/${req.params.postId}`, (err, response, body) => {
    if (err) return res.status(500).json({err});
    res.render('post', {post: JSON.parse(body).post});
  })
})

.get('/admin', (req, res) => {
  let title = 'Admin';
  request.get(`http://localhost:3000/api/posts/`, (err, response, body) => {
    if (err) return res.status(500).json({err})
    console.log(body);
    res.render('page', {title, admin: true, posts: JSON.parse(body).posts});
  });
})

.get('/:title', (req, res) => {
  let title = req.params.title;
  res.render('page', {title});
});

module.exports = Router;
