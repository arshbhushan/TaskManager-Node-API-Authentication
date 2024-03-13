const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  id: {
    type: Number, // Change the type to Number
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email address');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    // Remove the validation for the word "password"
  },
  phone_number: {
    type: Number, // Change the type to Number
    required: true
  },
  priority: {
    type: Number, // Change the type to Number
    enum: [0, 1, 2] // Only allow values 0, 1, or 2
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.tokens;

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '15h',
    algorithm: 'HS256'
  });

  // Remove existing tokens and add the new one
  user.tokens = [{ token }];
  await user.save();

  return token;
};


userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return user;
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
