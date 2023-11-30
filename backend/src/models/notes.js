const { model, Schema } = require("mongoose");

const notesSchema = new Schema ({
    taskName:{type: String, required: true},
    description: {type: String, required: true}
})

module.exports = model('notes', notesSchema);
