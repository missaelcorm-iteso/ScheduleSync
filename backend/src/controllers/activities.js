const Activity = require('./../models/activity');

class ActivitiesController {
    list(req, res){
        Activity.find().then((activities) => {
            res.send(activities);
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    }

    create(req, res){
        res.send("Activity created");
    }

    show(req, res){
        const id = req.params.id;
        Activity.findById(id).then((activity) => {
            if(activity){
                res.send(activity);
            } else {
                res.status(404).send({});
            }
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    }

    edit(req, res){
        const id = req.params.id;
        const activity = ids[id];
        res.send(activity);
    }

    delete(req, res){
        const id = req.params.id;
        const activity = ids[id];
        res.send(activity);
    }
}

module.exports = new ActivitiesController();