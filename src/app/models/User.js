const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  sex: { type: String, required: true },
  slug: { type: String, slug: 'username', unique: true },

  status: { type: String, required: true },
  cart: [{
    prod: { type: String },
    quant: { type: Number },
    price: { type: Number },
  }]
}, {
  timestamps: true,
});

User.statics = {
  findByUsername(username) {
    return this.findOne({ username: username });
  },

  async hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 7);
    return hashedPassword;
  }
}

User.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.password);
    // return password === this.password;
  },

  async setPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 7);
    this.password = hashedPassword;
  }
}

module.exports = mongoose.model('User', User);