const Post = require('../Router/models/PostModel');


module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', (client) => {
    console.log('User Connected');
    client.on('message', message => {
      console.log('message received', message);
      io.emit('newMessage', message);
    });
    client.on('comment', comment => {
      console.log('comment received', comment);
      Post.findByIdAndUpdate(comment.postId, {
        $push:{
          "comments": comment
        }}, {
          safe: true,
          upsert: true,
          new: true
        }, (err) => {
          if (err) return console.log(err);
          io.emit('newComment', comment);
        })
    });
    client.on('disconnect', () => {console.log('disconnected');})
  })
}
