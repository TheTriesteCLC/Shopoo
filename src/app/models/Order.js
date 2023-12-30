const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Order = new Schema({
    country: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String },
    street: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    postal: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String },
    promo: { type: String },

    username: { type: String, required: true },
    cart: [{
        prod: { type: String },
        quant: { type: Number },
        price: { type: Number },
    }],
    slug: { type: String, slug: 'firstName', unique: true }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', Order);