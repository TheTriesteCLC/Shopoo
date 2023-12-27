const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const { Product } = require('./Product');
const { Review } = require('./Review');
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
    cart: [{ type: Schema.Types.ObjectId, ref: 'Product', quant: { type: Number } }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', User);