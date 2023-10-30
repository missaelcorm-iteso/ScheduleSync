const {model, Schema} = require('mongoose');

const schema = new Schema({
    name: {type: String, require: true},
    location: {type: String, require: true},
    time: {type: Number, require: true},
    details: {type: String, require: true}
})

module.exports = model('activities', schema);