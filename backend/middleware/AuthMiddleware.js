const jwt = require('jsonwebtoken')
const User = require('../model/User')

let AuthMiddleware = (req, res, next) => {
    let token = req.cookies.jwt
    if (!token) {
        return res.status(401).json({ msg: "unauthenticated" })
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedValue) => {
        if (err) {
            return res.status(401).json({ msg: "unauthenticated" })
        }
        try {
            let user = await User.findById(decodedValue._id).select('-password')
            if (!user) {
                return res.status(401).json({ msg: "unauthenticated" })
            }
            req.user = user
            next()
        } catch (e) {
            return res.status(401).json({ msg: "unauthenticated" })
        }
    })
}

// CMS / dashboard: owner or admin
let requireAdmin = (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'owner')) {
        return res.status(403).json({ msg: "admin only" })
    }
    next()
}

// Users management: owner only
let requireOwner = (req, res, next) => {
    if (!req.user || req.user.role !== 'owner') {
        return res.status(403).json({ msg: "owner only" })
    }
    next()
}

module.exports = AuthMiddleware
module.exports.requireAdmin = requireAdmin
module.exports.requireOwner = requireOwner
module.exports.AuthMiddleware = AuthMiddleware
