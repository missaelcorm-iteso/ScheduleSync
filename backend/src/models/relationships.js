const { model, Schema } = require('mongoose');

const relationshipSchema = new Schema({
    user1: {type: Schema.Types.ObjectId, ref: 'users', required: false},
    user2: {type: Schema.Types.ObjectId, ref: 'users', required: false},
    name: {type: String, required: true}

});

module.exports = model('relationship', relationshipSchema)