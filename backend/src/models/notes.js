const { model, Schema } = require("mongoose");

const notesSchema = new Schema ({
    taskName:{type: String, required: true},
    description: {type: String, required: true},
    createdBy: {type: Schema.Types.ObjectId, required: false}
})

module.exports = model('notes', notesSchema);
