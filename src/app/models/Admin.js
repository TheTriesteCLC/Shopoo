const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Admin = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    sex: { type: String, required: true },
    canBan: { type: Boolean, required: true },
    canAdd: { type: Boolean, required: true },
    slug: { type: String, slug: 'adminname', unique: true }
}, {
    timestamps: true,
});

Admin.statics = {
    findByUsername(username) {
      return this.findOne({ adminname: username });
    }
}
  
Admin.methods = {
    comparePassword(password) {
      return bcrypt.compare(password, this.password);
      // return password === this.password;
    }
}

module.exports = mongoose.model('Admin', Admin);