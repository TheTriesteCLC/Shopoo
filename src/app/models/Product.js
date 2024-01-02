const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Product = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },

    top: { type: Boolean, required: true },
    bottom: { type: Boolean, required: true },
    accessories: { type: Boolean, required: true },
    outer: { type: Boolean, required: true },
    shoes: { type: Boolean, required: true },
    popular: { type: Boolean, required: true },
    from: { type: String, required: true },
    date: { type: Number, required: true },

    stock: { type: Number, required: true },
    status: { type: String, required: true },

    slug: { type: String, slug: 'name', unique: true },
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', Product);