const express =require("express")
const auth=require("./routes/auth")
const app=express()

app.use(express.json())
app.use("/auth",auth);

app.listen(3000)