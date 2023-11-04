const User = require('./../models/user');

class UsersController {
    list(req, res){
        User.find().then((users) => {
            res.send(users);
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    }

    create(req, res){
        res.send("User created");
    }

    show(req, res){
        const id = req.params.id;
        User.findById(id).then((user) => {
            if(user){
                res.send(user);
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
        const user = ids[id];
        res.send(user);
    }

    delete(req, res){
        const id = req.params.id;
        const user = ids[id];
        res.send(user);
    }
}

module.exports = new UsersController();