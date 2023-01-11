const jwt = require('jsonwebtoken');

// generate access tokent
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "1800s"})
}

module.exports = generateAccessToken;