const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  provider: {
    type: String
  },
  profilePicture: {
    type: String
  },
  admin: {
    type: Boolean,
    default: false,
    required: true
  },
  posts: Array
});

UserSchema.methods.isValidPassword = function (password) {
  console.log('Validating Password');
  return bcrypt.compareSync(password, this.password);
}

// mongoose.connect('mongodb://localhost/spectre');

UserSchema.pre('save', function(next) {
  const user = this;
  // Only hash password if it has been modified or is new
  if (!user.isModified('password')) {
    console.log('Password not modified');
    return next();
  }

  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) return next(err);

    // Replace password with the hashed one
    user.password = hash;
    next();
  });
});
const User = mongoose.model('user', UserSchema);

module.exports = User;
