const { model, Schema } = require('mongoose');

const relationshipSchema = new Schema({
    user1: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    user2: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    type: {type: String, required: true}
    //close friend, family etc.

});

module.exports = model('relationship', relationshipSchema)