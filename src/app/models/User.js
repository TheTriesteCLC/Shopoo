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
    cart: [{
        prod: { type: String },
        quant: { type: Number },
        price: { type: Number },
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', User);