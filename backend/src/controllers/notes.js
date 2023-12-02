const Note = require('./../models/notes');
const User = require('./../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class notesController{
    list(req, res) {
        const token = req.headers.authorization;
        const secretKey = process.env.SECRET_KEY;

        jwt.verify(token , secretKey, (err, decoded) => {
            if(err) {
                console.log('JWT error: ', err);
                res.status(401).send('invalid token');
                return;
            }
            const userId = decoded.id;

            Note.find({ userId }).then((notes) => {
                res.send(notes);
            }).catch((err) => {
                res.status(500).send({ message: 'Error retrieving notes'});
                console.log(err);
            });
        })
    }

    create(req, res) {
        const { taskName, description} = req.body;
        const secretKey = process.env.SECRET_KEY;
        const token = req.headers.authorization;
        jwt.verify(token, secretKey, (err, decoded) => {
            if(err) {
                console.log('JWT error: ', err);
                res.status(401).send('invalid token');
                return;
            }
            console.log('decoded: ', decoded);
            const userId = decoded.id;

            if(!taskName || !description){
            res.status(400).send({ message: 'Missing fields'});
                return;
            }
        
            User.findById(userId).then((user) => {
                if(user) {
                    const note = new Note({ taskName, description, userId});
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
        });
    }    

    show(req, res) {
        const noteId = req.params.id;
        Note.findById(noteId).then((note) => {
            if(!note) {
                res.status(404).send({ message: 'Note not found'});
                return;
            }
            res.send(note);
        }).catch((err) => {
            res.status(500).send({ message: 'Error getting the note'})
        });
        
    }

    

    delete(req, res) {
        const noteId = req.params.id;
        const token = req.headers.authorization;
        const secretKey = process.env.SECRET_KEY;
    
        jwt.verify(token, secretKey, (err, decoded) => {
            if(err) {
                console.log('JWT error: ', err);
                res.status(401).send('invalid token');
                return;
            }
    
            const userId = decoded.id;
    
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
        });
    }
}

module.exports = new notesController();

