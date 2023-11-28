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
        const { user1, user2, type } = req.body;

        if(!user1 || !user2 || !type){
            res.status(400).send({ message: 'Missing fields'});
            return;
        }
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
        const { user1, user2, type} = req.body;

        if(!user1 || !user2 || !type){
            res.status(400).send({ message: 'Missing fields'});
            return;
        }

        Relationship.findByIdAndUpdate(id, { user1, user2, type}, { new: true }).then((updatedRelationship) => {
            if(!updatedRelationship) {
                res.status(404).send({ message: 'Relationship not found'});
            } else {
                res.send(updatedRelationship);
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error updating the relationship'});
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

module.exports = new RelationshipController();
