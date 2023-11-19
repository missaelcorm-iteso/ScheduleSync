const {model, Schema} = require('mongoose');

const activitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true},
    title: { type: String, required: true },
    owner: { type: String, required: true },
    location: { type: String},
    start_date: { type: Number, required: true },
    end_date: { type: Number},
    is_private: { type: Boolean, default: true }
});

module.exports = model('activities', activitySchema);