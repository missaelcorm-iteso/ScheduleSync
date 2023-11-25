const mongoose = require('mongoose');

const scheduleEntrySchema = new mongoose.Schema({
    day: {
      type: String, // Assuming the day is represented as a string (e.g., 'Monday')
      required: true,
    },
    startTime: {
      type: String, // Assuming time is represented as a string (e.g., '9:00 AM')
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    classroom: {
      type: String,
      required: true,
    },
  });
  

const scheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    scheduleData: [scheduleEntrySchema],
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;