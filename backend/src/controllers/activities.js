const Activity = require('./../models/activity');
const User = require('./../models/user');

class ActivitiesController {
    list(req, res){
        const userId = req.user.id;

        Activity.find({ userId }).then((activities) => {
            res.send(activities);
        }).catch((err) => {
            res.status(500).send({ message: 'Error retrieving activities' });
            console.log(err);
        });
    }

    create(req, res){
        const { title, location, description, start_date, end_date, is_private } = req.body;
        const userId = req.user.id;
        
        User.findById(userId).then((user) => {
            if(user){
                const newActivity = new Activity({ userId, title, owner: user.name, location, description, start_date, end_date, is_private });
                newActivity.save().then(() => {
                    res.status(201).send({ message: 'Activity created' });
                }).catch((err) => {
                    res.status(500).send({ message: 'Error creating activity' });
                    console.log(err);
                });
            }
            else{
                res.status(404).send({ message: 'User not found' });
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error retrieving user' });
            console.log(err);
        });
    }

    show(req, res){
        const userId = req.user.id;
        const activityId = req.params.activityId;

        Activity.findOne({ _id: activityId, userId }).then((activity) => {
            if(activity){
                res.send(activity);
            } else {
                res.status(404).send({});
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error retrieving activity' });
            console.log(err);
        });
    }

    edit(req, res){
        const userId = req.user.id;
        const activityId = req.params.activityId;

        Activity.findOne({ _id: activityId, userId }).then((activity) => {
            if(activity){
                const { title, location, description, start_date, end_date, is_private } = req.body;
                activity.title = title;
                activity.location = location;
                activity.description = description;
                activity.start_date = start_date;
                activity.end_date = end_date;
                activity.is_private = is_private;
                activity.save().then(() => {
                    res.send({ message: 'Activity updated' });
                }).catch((err) => {
                    res.status(500).send({ message: 'Error updating activity' });
                    console.log(err);
                });
            } else {
                res.status(404).send({});
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error retrieving activity' });
            console.log(err);
        });
    }

    delete(req, res){
        const userId = req.user.id;
        const activityId = req.params.activityId;

        Activity.findOneAndDelete({ _id: activityId, userId }).then((activity) => {
            if(activity){
                res.send({ message: 'Activity deleted' });
            } else {
                res.status(404).send({});
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error retrieving activity' });
            console.log(err);
        });
    }

    complete(req, res){
        const userId = req.user.id;
        const activityId = req.params.activityId;

        Activity.findOne({ _id: activityId, userId }).then((activity) => {
            if(activity){
                activity.is_completed = true;
                activity.save().then(() => {
                    res.send({ message: 'Activity completed' });
                }).catch((err) => {
                    res.status(500).send({ message: 'Error completing activity' });
                    console.log(err);
                });
            } else {
                res.status(404).send({});
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error retrieving activity' });
            console.log(err);
        });
    }
}

module.exports = new ActivitiesController();