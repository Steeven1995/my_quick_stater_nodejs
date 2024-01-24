const jwt = require('jsonwebtoken');

function isAuthenticateWithToken(req , res, next){

    const authHeader = req.headers['authorization']; // Bearer {token}
    const token = authHeader && authHeader.split(' ')[1];
  
    if(!token){
      console.log("error");
      return res.sendStatus(403);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
      if(err){
        return res.sendStatus(401);
      }
      req.user = user;
      next()
    })
}

module.exports = isAuthenticateWithToken;
  