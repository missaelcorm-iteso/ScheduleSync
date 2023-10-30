const activityModel = require('./../models/activities');

class activityController {
    view(req, res) {
        activitiesModel.find(),then(activities => {
            res.json(activities);
        }).catch(e => {
            console.log(e);
            res.status(500).json({
                error: 'There was an issue getting the activities.'
            });
        });
    }

    async create(req, res) {
        const activitityData = req.body;

        try {
            const activity = new activityModel(activitityData);
            await activity.save();
            res.status(201).json(activity);
        } catch (error) {
            console.log(error);
            res.status(400).json({
                error: 'There was an error creating the activity.'
            })
        }
    }
}