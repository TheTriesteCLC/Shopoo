const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Admin = new Schema({
    adminname: { type: String, required: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Admin', Admin);