const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    if(!authHeader || !token){
        return res.status(401).json({message:"Access Denied. No token."});
    }
    else{
        try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
        }
        catch(error){
            return res.status(401).json({message:"Invalid login"});
        }
    }
}

module.exports = authMiddleware;