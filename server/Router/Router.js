const express = require('express');
const Router = express.Router();
const request = require('request');
const port = process.env.PORT || 3000;
const md = require('markdown').markdown;

Router.get('/', (req, res) => {
  res.render('index', {
    title: "My Other title",
    feature: {
      image: 'https://unsplash.it/1200/900?image=1059'
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
  res.render('page', {
    title: 'About',
    feature: {
      image: 'https://unsplash.it/1200/800/'
    },
    body: JSON.stringify(body)
  });
})

.get('/posts', (req, res) => {
  let title = 'Blog';
  request.get(`http://localhost:${port}/api/posts`, (err, response, body) => {
    if (err) return res.status(500).json({err});
    res.render('blog', {title, posts: JSON.parse(body).posts, md});
  })
})

.get('/posts/:postId', (req, res) => {
  request.get(`http://localhost:${port}/api/posts/${req.params.postId}`, (err, response, body) => {
    if (err) return res.status(500).json({err});
    let bodyObject = JSON.parse(body);
    if (!bodyObject.post) return res.status(404).redirect('/not-found');
    res.render('post', { title: bodyObject.post.title, post: bodyObject.post, posts: bodyObject.posts, md });
  })
})

.get('/admin', (req, res) => {
  let title = 'Admin';
  request.get(`http://localhost:${port}/api/posts/`, (err, response, body) => {
    if (err) return res.status(500).json({err});
    res.render('page', {title, admin: true, posts: JSON.parse(body).posts});
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

.get('/*', (req, res) => {
  let title = 'Page Not Found';
  res.render('page', {title});
});

module.exports = Router;
