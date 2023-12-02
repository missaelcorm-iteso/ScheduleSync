const Relationship = require('./../models/relationships');
const User = require('./../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();


class relationshipController{
    list(req, res) {
        const userId = req.user.id;
    
        const query = {
            $or: [
                {user1: userId},
                {user2: userId}
            ]
        }
    
        console.log('Query:', query);
    
        Relationship.find(query).populate('user1 user2').then((relationships) => {
            const friends = relationships.map((relationship) => {
                return relationship.user1._id.toString() === userId ? relationship.user2 : relationship.user1;
            });
            res.send(friends);
        }).catch((err) => {
            console.error('Error while getting your friends:', err);
            res.status(500).send({ message: 'Error while getting your friends' });
        })
    };

    create(req, res) {
        const { name } = req.body;
        const userId = req.user.id;

        if(!name){
            res.status(400).send({ message: 'Missing fields'});
            return;
        }
        User.findOne({ name}).then((friend) => {
            if(!friend){
                res.status(404).send({ message: 'User not found'});
                console.log('user not found');
                return;
            }

            const query = {
                $or: [
                    {user1: userId, user2: friend.id},
                    {user1: friend.id, user2: userId}
                ]
            }
            console.log('Query:', query);

            Relationship.findOne(query).then((exisitingRelationship) => {
                if(exisitingRelationship){
                    res.status(400).send({ message: 'Friend already added'});
                } else {
                    const relationship = new Relationship({
                        user1: userId,
                        user2: friend.id
                    });

                    relationship.save().then(() => {
                        res.status(201).send({  message: 'Friend added'});
                    }).catch((err) => {
                        console.error('Error while saving your friend', err);
                        res.status(500).send({ message: 'Error while saving your friend'});
                    });
                }
            }).catch((err) => {
                console.error('Error while getting your friend', err);
                res.status(500).send({ message: 'Error while getting your friend'});
            });
        }).catch((err) => {
            console.error('Error while getting your friend', err);
            res.status(500).send({ message: 'Error while getting your friend'});
        })
    }
    
    

    delete(req, res) {
        const userId = req.user.id;
        const friendId = req.params.id;
    
        const query = {
            $or: [
                {user1: userId, user2: friendId},
                {user1: friendId, user2: userId}
            ]
        };
    
        Relationship.findOneAndDelete(query).then((deletedRelationship) => {
            if(!deletedRelationship) {
                res.status(404).send({ message: 'Friend not found'});
            } else {
                res.send({ message: 'Friend deleted successfully'});
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error deleting the friend'});
        })
    }
}

module.exports = new relationshipController();
