import jwt from 'jsonwebtoken'
require('dotenv').config()
const authMiddleware = (req, res, next) => {
    // const token = req.headers.token.split(' ')[1];
    const token = req.headers.authorization.split(' ')[ 1 ];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                status: 'ERR',
                message: 'Invalid token admin!',
            })
        }
        const payload = user;
        if (payload?.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                status: 'ERR',
                message: 'No authorization!'
            })
        }
    })
}

const authUserMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[ 1 ];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                status: 'ERR',
                message: 'Invalid token user!',
            })
        }
        // const { payload } = user;
        const payload = user;
        if (payload.id) {
            next();
        } else {
            return res.status(403).json({
                status: 'ERR',
                message: 'No authorization!'
            })
        }
    })
}

module.exports = {
    authMiddleware,
    authUserMiddleware,
}