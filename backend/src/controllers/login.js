const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const bcrypt = require('bcrypt');
secretkey = process.env.SECRET_KEY;

class LoginController {

    login(req, res) {
        const { email, password } = req.body;

        User.findOne({ email }).then((user) => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign(
                    { 
                        id: user._id,
                        email: user.email
                    }, secretkey);
                    console.log('Generated token:' ,token);
                res.send({ token, userId: user._id });
            } else {
                res.status(401).send({ message: 'Invalid credentials' });
            }
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    }
}

module.exports = new LoginController();