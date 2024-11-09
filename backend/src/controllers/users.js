const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const User = require('./../models/user');
const file = require('./../models/file');

class UsersController {
    list(req, res){
        User.find().then((users) => {
            res.send(users);
        }).catch((err) => {
            res.status(500).send({ message: 'Error while searching the users'});
        });
    }

    create(req, res){
        const { name, email, password, birthdate } = req.body;

        if(!name || !email || !password || !birthdate){
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
            const newUser = new User({ name, email, password: bcrypt.hashSync(password, 10), birthdate });
            newUser.save().then(() => {
                res.status(201).send({ message: 'User created' });
            }).catch((err) => {
                res.status(500).send({ message: 'Error while saving the user' });
            });
        }).catch((err) => {
            res.status(500).send({ message: 'Error while searching the user' });
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
            res.status(500).send({ message: 'Error while searching the user' });
        });
    }

    edit(req, res){
        const id = req.params.id;
        const { name, email, password, birthdate } = req.body;

        if(!name && !email && !password && !birthdate){
            res.status(400).send({ message: 'Missing fields' });
            return;
        }

        if(password){
            if(password.length < 6){
                res.status(400).send({ message: 'Password must be at least 6 characters long' });
                return;
            }
        }

        User.findById(id).then((user) => {
            if(user){
                if (name) {
                    user.name = name;
                }
                if (email) {
                    user.email = email;
                }
                if (birthdate) {
                    user.birthdate = birthdate;
                }
                if (password) {
                    user.password = bcrypt.hashSync(password, 10);
                }
                user.save().then(() => {
                    res.send(user);
                }).catch((err) => {
                    res.status(500).send({ message: 'Error while saving the user' });
                });
            } else {
                res.status(404).send({});
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error while searching the user' });
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
            res.status(500).send({ message: 'Error while searching the user' });
        });
    }

    upload(req, res){
        const id = req.params.id;
        const filename = req.file;

        if(!filename){
            res.status(400).send({ message: 'File not supported' });
            return;
        }

        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`; 

        file.create({
            userId: id,
            name: req.file.originalname,
            key: req.file.key,
            url: fileUrl,
            size: req.file.size,
            mimetype: req.file.mimetype,
            created_at: Date.now(),
        }).then((file) => {
            res.send(file);
        }).catch((err) => {
            console.error('Error while saving the file', err);
            res.status(500).send({ message: 'Error while saving the file' });
        })
    }

    attachments(req, res){
        const id = req.params.id;
        file.find({ userId: id }).then((files) => {
            res.send(files);
        }).catch((err) => {
            console.error('Error while searching the files', err);
            res.status(500).send({ message: 'Error while searching the files' });
        });
    }
}

module.exports = new UsersController();