const { model, Schema } = require('mongoose');

const sharedActitivityschema = new Schema({
    user1: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    user2: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    actitivity: {type: Schema.Types.ObjectId, ref: 'activity', required: true}

});

module.exports = model('SharedActivity',sharedActitivityschema);