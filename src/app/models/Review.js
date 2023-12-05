const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Review = new Schema({
    product: { type: String, required: true },
    user: { type: String, required: true },
    comment: { type: String, required: true }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Review', Review);