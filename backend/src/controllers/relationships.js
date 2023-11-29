const Relationship = require('./../models/relationships');

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

        if(!name){
            res.status(400).send({ message: 'Missing fields'});
            return;
        }

        Relationship.findOne({ name }).then((existingRelationship) => {
            if (existingRelationship) {
                res.status(400).send({ message: 'Friend already added' });
            } else {
                const newRelationship = new Relationship({ name });
                newRelationship.save().then(() => {
                    res.status(201).send({ message: 'Friend added' });
                }).catch((err) => {
                    res.status(500).send({ message: 'Error while saving your friend' });
                });
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error while searching for your friend' });
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
