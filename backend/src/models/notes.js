const { model, Schema } = require("mongoose");

const notesSchema = new Schema ({
    noteName:{type: String, required: true},
    description: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'users'}
})

module.exports = model('notes', notesSchema);
