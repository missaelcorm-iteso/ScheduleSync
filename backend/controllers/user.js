const userModel = require('./../models/users');

class userController {
    view(req, res) {
        userModel.find(),then(users => {
            res.json(users);
        }).catch(e => {
            console.log(e);
            res.status(500).json({
                error: 'There was an issue getting the users.'
            });
        });
    }

    async create(req, res) {
        const userData = req.body;

        try {
            const user = new userModel(userData);
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            console.log(error);
            res.status(400).json({
                error: 'There was an error creating the movie.'
            })
        }
    }
}