import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import 'dotenv/config'
import  errorHandler from'./src/middlewares/errorHandler.js'
import leaveRoutes from "./src/routers/leaveRoutes.js"
import userRoutes from "./src/routers/userRoutes.js"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({origin:["http://localhost:5173","https://leave-management-ziya.vercel.app"],
    credentials:true}))
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongoose connected") )
.catch((err)=>console.log(err) )

app.use("/api/leaves", leaveRoutes);
app.use("/api/user", userRoutes);

app.use(errorHandler)


app.listen(process.env.PORT || 7001, ()=>{
    console.log("server running");
    
})