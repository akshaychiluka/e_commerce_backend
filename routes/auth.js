const express=require("express")
const {PrismaClient}=require("@prisma/client")
const prisma= new PrismaClient()

const router=express.Router()
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
const secretKey="ushhhhhh";


router.post("/signup",async (req,res)=>{
    const {username,email,password}=req.body;
    const pass=await bcrypt.hash(password,10);
    try{
        const user=await prisma.user.create({
            data:{
                username,
                email,
                password:pass
            }
        })
        res.status(200).json({message:"user created sucessfully",
            user_data:user
        })  
    }
    catch(error){
        res.status(404).json({
            error:"error while creating the user"
        })
    }
})
router.post("/signin",async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user||await bcrypt.compare(user.password,password)){
            res.status(404).json({error:"Invalid username or password"})
        }
        const token=jwt.sign({user_id:user.id},secretKey);
        res.status(200).json({
            message:"login sucessful",
            token:token
        })
    }
    catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
})

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


module.exports=router;