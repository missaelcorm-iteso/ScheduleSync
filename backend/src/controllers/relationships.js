const Relationship = require('./../models/relationships');
const User = require('./../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();


class relationshipController{
    list(req, res) {
        const token = req.headers.authorization;
        const secretkey = process.env.SECRET_KEY;
        
        jwt.verify(token, secretkey, (err, decoded) => {
            if(err) {
                console.log('JWT error: ', err);
                res.status(401).send('invalid token');
                return
            }

            const query = {
                $or: [
                    { user1: decoded.id },
                    { user2: decoded.id },
                ],
            };

            console.log('Query:', query);

            Relationship.find(query).populate('user1 user2').then((relationships) => {
                const friends = relationships.map((relationship) => {
                    return relationship.user1._id.toString() === decoded.id ? relationship.user2 : relationship.user1;
                });
                res.send(friends);
            }).catch((err) => {
                console.error('Error while getting your friends:', err);
                res.status(500).send({ message: 'Error while getting your friends' });
            })
        }
    )};

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
                jwt.verify(token, secretkey, (err, decoded) => {
                    if(err) {
                        console.log('JWT error: ', err);
                        res.status(401).send('invalid token');
                        return
                    }


                    console.log('hi from token', decoded);
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
                                    user1: decoded.id,
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
                });

                
            })
            .catch((err) => {
                console.error('Error while checking friend existence:', err);
                res.status(500).send({ message: 'Error while checking friend existence' });
            });
    }
    
    

    delete(req, res) {
        const token = req.headers.authorization;
        const secretkey = process.env.SECRET_KEY;
        const friendId = req.params.id;

        jwt.verify(token, secretkey, (err, decoded) => {
            if(err) {
                console.log('JWT error: ', err);
                res.status(401).send('invalid token');
                return;
            }

            const  query = {
                $or: [
                    {user1: decoded.id, user2: friendId},
                    {user2: friendId, user2: decoded.id}
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
        })
    }
}

module.exports = new relationshipController();
