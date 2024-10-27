//require('dotenv').config();
const secretKey=process.env.secretKey;
const jwt=require('jsonwebtoken');

function authenticateToken(req,res,next){
    const token=req.headers["autherization"];
    jwt.verify(token,secretKey,(err,user)=>{
        if(err){
            return  res.status(403).json({ error: "Invalid token" });
        }
        req.user=user;
        next();
    });
}

module.exports={authenticateToken};