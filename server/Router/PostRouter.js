const bodyParser = require('body-parser');
const multer = require('multer');
const image = require('../helpers/images');
const md = require('markdown').markdown;
const Post = require('./models/PostModel');
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
const fileFilter = (req, file, cb) => {
  console.log(file.mimetype.split('/')[0]);
  if (file.mimetype.split('/')[0] !== 'image') {
    console.log('The file is not an image');
    req.flash('error', 'The file is not an image');
    return cb(null, false);
  }
  cb(null, true);
}
const upload = multer({
  storage,
  fileFilter
});

module.exports = (app, passport) => {

  /************
    Routes protected from index.js
  ************/
  app.get('/admin/post/add', (req, res) => {
    let title = "Add";
    let message = req.flash('error')[0];
    res.render('page', {title, add: true, message, md, user: req.user});
  })


  /*****
  Add New Post
  *****/

  .post('/admin/post/add', upload.single('image'), (req, res) => {
    let postObject = req.body;

    // If file is not an image redirect to add post form with flash error message
    if (!req.file) {
      req.flash('error', 'The File Is Not an Image');
      return res.redirect('/admin/post/add');
    }
    postObject.image = req.file.filename;
    postObject.summary = `${postObject.content.substring(0, 96)} ....`;
    postObject.slug = Date.now() + "-" + req.body.title.replace(/[^a-zA-Z ]/g, "").toLowerCase().split(' ').join('-');
    postObject.author = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      _id: req.user._id,
      profilePicture: req.user.profilePicture
    }

    image.resize(postObject.image);

    let post = new Post(postObject);

    if (post) {
      post.save().then((post) => {
        console.log(post._id); // Need to Add post id to users posts Array
        return res.status(200).redirect('/posts');
      }).catch(err => {
        console.log(err, 'Error while saving post');
        res.status(500).redirect('/posts');
      })
    } else {
      console.log('There was an error - No Post object created');
      res.status(500).redirect('/posts');
    }
  })


  /*****
  Load Edit View exiting Post
  *****/

  .get('/admin/post/edit/:postId', (req, res) => {
    let title = "Edit";
    Post.findOne({ _id: req.params.postId }, (err, post) => {
      if (!post) {
        return res.status(404).redirect('/admin');
      }
      /**
      Return if current user is not the author of the post
      **/
      if (req.user._id.toString() !== post.author._id) {
        return res.status(401).redirect('/admin');
      }
      post.date = post.date.split('T')[0];
      res.render('page', {title, edit: true, post, md, user: req.user});
    });
  })

  /*****
  Edit Post
  *****/

  .post('/admin/post/edit/:postId', upload.single('image'), (req, res) => {
    Post.findById(req.params.postId).exec().then(post => {
      // Return Unauthorized if current user is not the author of the post
      if (post.author._id !== req.user._id.toString()) {
        console.log('Not Authorized to Delete');
        return res.status(401).redirect('/admin');
      }

      // Create updated post object with new values
      let updatePost = {
        title: req.body.title,
        date: req.body.date,
        content: req.body.content,
        summary: `${req.body.content.substring(0, 96)} ....`
      }

      // If uploaded file exists resize image, delete old files and update image path on the post object
      // Perhaps needs to notify if file is not an image
      if (req.file) {
        updatePost.image = req.file.filename;
        image.resize(updatePost.image);
        if (req.body.currentImage) {
          image.delete(req.body.currentImage);
        }
      }

      // Update the post on the DB
      Post.update({
        _id: req.params.postId
      }, {
        $set: updatePost
      }).exec().then((post) => {
        console.log('Successfully Updated Post', post);
        return res.status(200).redirect('/admin');
      }).catch(err => {
        console.log(err);
        return res.status(500).redirect('/admin');
      });

    }).catch(err => {
      console.log(err);
      res.status(500).redirect('/admin');
    });

  })


  /*****
  Delete Post by id
  *****/

  .get('/admin/post/delete/:postId', (req, res) => {

    Post.findById(req.params.postId).exec().then(post => {
      // Return Unauthorized if current user is not the author of the post
      if (post.author._id !== req.user._id.toString()) {
        console.log('Not Authorized to Delete');
        return res.status(401).redirect('/admin');
      }
      // Delete Post Images from filesystem
      if (post && post.image) {
        image.delete(post.image);
      }
    }).then(() => {
      // Remove Post data from the DB and redirect to /admin
      console.log('Removing Post from the Database');
      Post.findById(req.params.postId).remove().then(() => {
        console.log('SuccessFully Deleted from the database');
        return res.redirect('/admin')
      }).catch(err => {
        console.log(err, 'Error Deleting From The DB');
        return res.redirect('/admin')
      });
    }).catch(err => {
      console.log(err);
      res.redirect('/admin')
    })
  });

}
