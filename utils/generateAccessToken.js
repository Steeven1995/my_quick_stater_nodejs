const jwt = require('jsonwebtoken');
require('dotenv').config();

// generate access tokent
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "1800s"})
}

module.exports = generateAccessToken;