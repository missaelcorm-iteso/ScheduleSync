const Note = require('./../models/notes');
const User = require('./../models/user');

class notesController{
    list(req, res) {
        const userId = req.user.id;

        Note.find({ userId }).then((notes) => {
            res.send(notes);
        }).catch((err) => {
            res.status(500).send({ message: 'Error getting your notes'});
            console.log(err);
        })
    }

    create(req, res) {
        const { noteName, description} = req.body;
        const userId  = req.user.id;

            if(!noteName || !description){
            res.status(400).send({ message: 'Missing fields'});
                return;
            }
        
            User.findById(userId).then((user) => {
                if(user) {
                    const note = new Note({ noteName, description, userId});
                    note.save().then(() => {
                        res.status(201).send({ message: 'Note created successfully'});
                    }).catch((err) => {
                        res.status(500).send({ message: 'There was a problem creating the note'});
                        console.log(err);
                });
            } else {
                res.status(404).send({ message: 'User not found'});
            }
        }).catch((err) => {
            res.status(500).send({ message: 'There was a problem creating the note'});
            console.log(err);
        });
    };
       

    

    delete(req, res) {
        const noteId = req.params.id;
        const userId = req.user.id;
    
        Note.findOneAndDelete({ _id: noteId, userId }).then((note) => {
            if(note) {
                res.send({ message: 'Note deleted successfully' });
            } else {
                res.status(404).send({ message: 'Note not found' });
            }
        }).catch((err) => {
            res.status(500).send({ message: 'Error occurred while deleting the data' });
            console.log(err);
        });
    };
}


module.exports = new notesController();

