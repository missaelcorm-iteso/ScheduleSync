const Schedule = require('../models/schedule');

const createScheduleEntry = async (req, res) => {
  try {
    const { userId, day, startTime, endTime, className, classroom } = req.body;
    
    const scheduleEntry = {
      day,
      startTime,
      endTime,
      className,
      classroom,
    };

    const userSchedule = await Schedule.findOneAndUpdate(
      { user: userId },
      { $push: { scheduleData: scheduleEntry } },
      { new: true, upsert: true }
    );

    res.json({ success: true, userSchedule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUserSchedule = async (req, res) => {
  try {
    const { userId } = req.params;

    const userSchedule = await Schedule.findOne({ user: userId });

    res.json({ success: true, userSchedule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createScheduleEntry,
  getUserSchedule,
};
