const jwt = require('jsonwebtoken');
secretkey = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, secretkey, (err, decoded) => {
        if(err){
            res.status(401).send({ message: 'You are not authorized' });
        } else {
            req.user = decoded;
            next();
        }
    });
}

module.exports = authMiddleware;