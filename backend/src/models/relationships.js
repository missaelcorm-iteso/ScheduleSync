const { model, Schema } = require('mongoose');

const relationshipSchema = new Schema({
    user1: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    user2: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    name: {type: String, required: true}

});

module.exports = model('relationship', relationshipSchema)