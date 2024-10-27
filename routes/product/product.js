const express=require("express")
const {PrismaClient}=require("@prisma/client")
const prisma= new PrismaClient()
const jwt=require('jsonwebtoken');
const secretKey=process.env.secretKey;
const {authenticateToken}=require("../../middlewares/authmiddleware");
const check_Role=require("../../middlewares/check_Role")

const router=express.Router()

router.post("/add_category",async (req,res)=>{
    
})
router.post("/upload_product",authenticateToken,check_Role('ADMIN'),async (req,res)=>{
    const {name,description,price,stock}=req.body;
    try{
        const product=await prisma.product.create({
            data:{
                name,
                description,
                price,
                stock
            }
        })
        res.status(200).json({
            message:"product created sucessfully",
            product:product
        })
    }
    catch(error){

    }
})
router.get("/show_products",async(req,res)=>{
    try{
        const products=await prisma.product.findMany();
        res.status(200).json(products)
    }
    catch(error){
        message:"Internal error"
    }
})
module.exports=router;
