const {model, Schema} = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    birthdate: { type: Date, required: true },
});

module.exports = model('users', userSchema);