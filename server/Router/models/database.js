const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/spectre');
mongoose.Promise = global.Promise; //Plugin global Promises
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});
