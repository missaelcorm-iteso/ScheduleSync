const mongoose = require('mongoose');

const schema = new Schema ({
    name: {type: String, require: true},
    lastName: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true}
});

module.exports = model('users', schema);