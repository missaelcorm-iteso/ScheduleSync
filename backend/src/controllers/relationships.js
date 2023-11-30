const Relationship = require('./../models/relationships');
const User = require('./../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();


class relationshipController{
    list(req, res){
        Relationship.find().then((relationships) => {
            res.send(relationships);
        }).catch((err) => {
            res.status(500).send({ message: 'There was an error getting the relationship.'});
        })
    }

    create(req, res) {
        const { name } = req.body;
        const secretkey = process.env.SECRET_KEY;

        console.log(name);
    
        if (!name) {
            res.status(400).send({ message: 'Missing fields' });
            console.log('im here');
            return;
        }
    
        User.findOne({ name })
            .then((friend) => {
                if (!friend) {
                    res.status(404).send({ message: 'User not found' });
                    console.log('user not found.')
                    return;
                }
                const token = req.headers.authorization;
                console.log(token);
                console.log(process.env.SECRET_KEY);
                const decoded = jwt.verify(token, secretkey);
                console.log('hi from token');
                const query = {
                    $or: [
                        { user1: decoded.id, user2: friend.id },
                        { user1: friend.id, user2: decoded.id },
                    ],
                };
    
                console.log('Query:', query);
    
                Relationship.findOne(query)
                    .then((existingRelationship) => {
                        console.log('Existing Relationship:', existingRelationship);
                        if (existingRelationship) {
                            res.status(400).send({ message: 'Friend already added' });
                        } else {
                            const newRelationship = new Relationship({
                                user1: req.user.id,
                                user2: friend.id
                            });
    
                            newRelationship.save()
                                .then(() => {
                                    res.status(201).send({ message: 'Friend added' });
                                })
                                .catch((err) => {
                                    console.error('Error while saving your friend:', err);
                                    res.status(500).send({ message: 'Error while saving your friend' });
                                });
                        }
                    })
                    .catch((err) => {
                        console.error('Error while searching for your friend:', err);
                        res.status(500).send({ message: 'Error while searching for your friend' });
                    });
            })
            .catch((err) => {
                console.error('Error while checking friend existence:', err);
                res.status(500).send({ message: 'Error while checking friend existence' });
            });
    }
    
    
    
    

    show(req, res) {
        const { id } = req.params.id;

        Relationship.findById(id).then((relationship) => {
            if(!relationship) {
                res.status(404).send({ message: 'Relationship not found'});
            } else {
                res.send(relationship);
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error getting the relationship'})
        });
    }

    edit(req, res) {
        const { id } = req.params.id;
        const { user1, user2, name} = req.body;

        if(!name){
            res.status(400).send({ message: 'Missing fields'});
            return;
        }

        Relationship.findById(id).then((relationship) => {
            if(relationship) {
                if(user1){
                    relationship.user1 = user1;
                }
                if(user2){
                    relationship.user2 = user2;
                }
                if(type){
                    relationship.type = type;
                }
                relationship.save().then(() => {
                    res.send(relationship);
                }).catch((err) => {
                    res.status(500).send({ message: 'Error while saving the relationship'});
                });
            } else {
                res.status(404).send({});
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error while finding the relationship' });
        });
    }

    delete(req, res) {
        const { id } = req.params.id;

        Relationship.findByIdAndDelete(id).then((deletedRelationship) => {
            if(!deletedRelationship) {
                res.status(404).send({ message: 'Relationship not found'});
            } else {
                res.send({ message: 'Relation deleted successfully'});
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error deleting the relationship'});
        });
    }
}

module.exports = new relationshipController();
