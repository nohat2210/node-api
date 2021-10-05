const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  birthday: {
    type: String,
  },
  role: {
    type: String,
    emun: ['user', 'admin'],
    default: 'user',
  },
  authGoogleID: {
    type: String,
    default: null,
  },
  authFacebookID: {
    type: String,
    default: null,
  },
  authType: {
    type: String,
    emun: ['local', 'google', 'facebook'],
    default: 'local',
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

UserSchema.virtual('fullname').get(function () {
  return this.firstName + ' ' + this.lastName;
});

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
});

UserSchema.pre('save', async function (next) {
  try {
    if (this.authType !== 'local') next();
    //Generate a salt
    const salt = await bcrypt.genSalt(10);
    //Generate a hash password  (salt+hash)
    const hashPassword = await bcrypt.hash(this.password, salt);
    //Re-assign hash password
    this.password = hashPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (requestPassword) {
  try {
    return await bcrypt.compare(requestPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
