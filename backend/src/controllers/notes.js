const Note = require('./../models/notes');

class NotesController{
    list(req, res) {
        Note.find().then((notes) => {
            res.send(notes);
        }).catch((err) => {
            res.status(500).send({ message: 'There was an error getting the note'});
        })
    }

    create(req, res) {
        const { taskName, description, createdBy} = req.body;

        if(!taskName || !description){
            res.status(400).send({ message: 'Missing fields'});
            return;
        }
        Note.findOne({ taskName }).then((note) => {
            if(note){
                res.status(400).send({ message: 'Task already exist' });
                return;
            }
            const newNote = new Note({ taskName, description});
            newNote.save().then(() => {
                res.status(201).send({ message: 'Note created' });
            }).catch((err) => {
                res.status(500).send({ message: 'Error while saving the note' });
            });
        }).catch((err) => {
            res.status(500).send({ message: 'Error while searching the user' });
        });
    }

    show(req, res) {
        const id = req.params.id;
        Note.findById(id).then((note) => {
            if(!note) {
                res.status(404).send({ message: 'Note not found'});
                return;
            }
            res.send(note);
        }).catch((err) => {
            res.status(500).send({ message: 'Error getting the note'})
        });
        
    }

    edit(req, res) {
        const id = req.params.id;
        const { taskName, description } = req.body;

        if(!taskName || !description) {
            res.status(400).send({ message: 'Missing fields'});
            return;
        }

        Note.findByIdAndUpdate(id).then((note) => {
            if(note) {
                if(taskName) {
                    note.taskName = taskName;
                }
                if(description) {
                    note.description = description;
                }
                if(createdBy) {
                    note.createdBy = createdBy;
                }
                note.save().then(() => {
                    res.send(note);
                }).catch((err) => {
                    res.status(500).send({ message: 'Error while saving the note'});
                });
            } else {
                res.status(404).send({});
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error while searching for the note'});
        });
    }

    delete(req, res) {
        const id = req.params.id;

        Note.findByIdAndDelete(id).then((deletedNote) => {
            if(!deletedNote) {
                res.status(404).send({ message: 'Note not found'});
                return;
            }
            res.send({ message: 'Note deleted successfully'});
        }).catch((err) => {
            res.status(500).send({ message: 'Error occured while deleting the data'});
        });
    }
}

module.exports = new NotesController();

