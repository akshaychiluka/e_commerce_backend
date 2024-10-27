const express =require("express")
const user=require("./routes/user/auth")
const admin=require("./routes/admin/auth")
const product=require("./routes/product/product")
const app=express()

app.use(express.json())
app.use("/user",user);
app.use("/admin",admin);
app.use("/product",product);
app.listen(3000)