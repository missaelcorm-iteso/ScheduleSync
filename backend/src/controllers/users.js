const bcrypt = require('bcrypt');

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
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            res.status(400).send({ message: 'Missing fields' });
            return;
        }

        if(password.length < 6){
            res.status(400).send({ message: 'Password must be at least 6 characters long' });
            return;
        }

        User.findOne({ email }).then((user) => {
            if(user){
                res.status(400).send({ message: 'Email already in use' });
                return;
            }
            const newUser = new User({ name, email, password: bcrypt.hashSync(password, 10) });
            newUser.save().then(() => {
                res.status(201).send({ message: 'User created' });
            }).catch((err) => {
                res.sendStatus(500);
                console.log(err);
            });
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });

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
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            res.status(400).send({ message: 'Missing fields' });
            return;
        }

        if(password.length < 6){
            res.status(400).send({ message: 'Password must be at least 6 characters long' });
            return;
        }

        User.findById(id).then((user) => {
            if(user){
                user.name = name;
                user.email = email;
                user.password = bcrypt.hashSync(password, 10);
                user.save().then(() => {
                    res.send(user);
                }).catch((err) => {
                    res.sendStatus(500);
                    console.log(err);
                });
            } else {
                res.status(404).send({});
            }
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    }

    delete(req, res){
        const id = req.params.id;
        User.findByIdAndDelete(id).then((user) => {
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
}

module.exports = new UsersController();