const {model, Schema} = require('mongoose');

const attachmentsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true},
    name: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    created_at: { type: Number, required: true },
});

module.exports = model('attachments', attachmentsSchema);