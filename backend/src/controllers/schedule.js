const schedule = require('./../models/schedule');
const Schedule = require('./../models/schedule');
const User = require('./../models/user');

class ScheduleController {
    list(req, res) {
      const userId = req.user.id;

      Schedule.find({userId}).then((schedule) => {
        res.send(schedule);
      }).catch((error) => {
        res.status(500).send({message: 'There was an error getting your schedule...'});
        console.log(error);
      })
    }

    create(req, res) {
      const { day, startTime, endTime, className, classroom} = req.body;
      const userId = req.user.id;

      User.findById(userId).then((user) => {
        if (user) {
          const newSchedule = new Schedule({
            userId,
            scheduleData: [{ day, startTime, endTime, className, classroom}]
          });

          newSchedule.save().then(() => {
            res.status(201).send({ message: 'Schedule created'});
          }).catch((error) => {
            res.status(500).send({message: 'There was an error creating your schedule...'});
            console.log(error);
          });
        } else {
          res.status(404).send({ message: 'User not found :/'});
        }
      }).catch((error) => {
        res.status(500).send({ message: 'Error getting user'});
        console.log(err);
      });
    }

    show(req, res){
      const userId = req.user.id;
      const schduleId = req.params.scheduleId;

      Schedule.findOne({ _id: scheduleId, userId}).then((schedule) => {
        if(schedule) {
          res.send(schedule);
        } else {
          res.status(404).send({});
        }
      }).catch((error) => {
          res.status(500).send({ message: 'There was an error getting your schedule'});
          console.log(error);
      })
    }
}

module.exports = new ScheduleController();