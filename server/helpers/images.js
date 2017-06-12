const fs = require('fs');
const sharp = require('sharp');

module.exports = {
  resize: (filename) => {
    let originalImagePath = __dirname + '/../../public/images/posts/' + filename;
    let imagePath = __dirname + '/../../public/images/posts/scaled_' + filename;
    let thumbPath = __dirname + '/../../public/images/posts/thumbs/' + filename;

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
  },

  delete: (filename) => {
    const originalImagePath = `${__dirname}/../../public/images/posts/${filename}`;
    const imagePath = `${__dirname}/../../public/images/posts/scaled_${filename}`;
    const thumbPath = `${__dirname}/../../public/images/posts/thumbs/${filename}`;
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
};
