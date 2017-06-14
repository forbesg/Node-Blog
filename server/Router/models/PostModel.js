const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: String,
  slug: {
    type: String,
    unique: true
  },
  date: String,
  content: String, // Saved as markdown
  summary: String,
  image: String,
  author: {
    name: String,
    email: String,
    _id: String
  }
});


let Post = mongoose.model('post', postSchema);

module.exports = Post;
