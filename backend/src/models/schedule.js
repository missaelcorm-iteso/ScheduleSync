const {model, Schema} = require('mongoose');

const scheduleEntrySchema = new Schema({
    day:{type: String, required: true },
    startTime: { type: String, required: true},
    endTime: { type: String, required: true},
    className: { type: String, required: true},
    classroom: { type: String, required: true}
})

  

const scheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    scheduleData: [scheduleEntrySchema]
});


module.exports = model('Schedule', scheduleSchema);




//module.exports = model('users', userSchema);