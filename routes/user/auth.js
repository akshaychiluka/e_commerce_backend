const express=require("express")
const {PrismaClient}=require("@prisma/client")
const prisma= new PrismaClient()
require('dotenv').config();

const router=express.Router()
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
const { authenticateToken } = require("../../middlewares/authmiddleware");
const { connect } = require("mongoose");
const secretKey=process.env.secretKey;


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
            return res.status(404).json({error:"Invalid username or password"})
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
router.post("/cart",authenticateToken,async (req,res)=>{
    const{product_name,quantity}=req.body;
    try{
        const product=await prisma.product.findFirst({
            where:{
                name:product_name
            }
        })
        if(!product){
            return res.status(404).json("Product not found");
        }
        let cart=await prisma.cart.findUnique({
            where:{
                
                user_id:req.user.user_id,
            },
            include:{
                cart_item:true
            }
        })
        if(!cart){
            cart=await prisma.cart.create({
                data:{
                    user:{
                        connect:{id:req.user.user_id}
                    }
                }
            })
        }
       const existing_CartItem=cart.cart_item.find(
            (item)=>item.product_id===product.id
       )
       if(existing_CartItem){
            const updatedCartItem=await prisma.cart_item.update({
                where:{
                    id:existing_CartItem.id
                },
                data:{
                    quantity:existing_CartItem.quantity+quantity
                }
            })
            return res.status(200).json(updatedCartItem);
       }
       const new_CartItem=await prisma.cart_item.create({
        data:{
            quantity,
            cart:{connect:{id:cart.id}},
            product:{connect:{id:product.id}}
        }
       })
       return res.status(201).json(cart);
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports=router;