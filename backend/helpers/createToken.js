let jwt = require('jsonwebtoken')

let maxAge =  3 * 24 * 60 * 60

module.exports = function createtoken(_id){
    return jwt.sign({_id}, process.env.JWT_SECRET , {expiresIn :  maxAge})
}