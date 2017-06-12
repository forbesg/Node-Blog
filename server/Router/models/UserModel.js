const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
  email: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true} //Bcrypt Hashed Password
});

mongoose.connect('mongodb://localhost/spectre');

UserSchema.pre('save', function(next) {
  const user = this;
  console.log(user);
  // Only hash password if it has been modified or is new
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) return next(err);

    // Replace password with the hashed one
    user.password = hash;
    next();
  })
});
const User = mongoose.model('user', UserSchema);

module.exports = User;
