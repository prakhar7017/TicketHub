import mongoose from "mongoose";
import { app } from "./app";
const PORT=process.env.PORT || 3000;
import { ServerError } from "@prakhartickets/common"

const start=async ()=>{
    if(!process.env.JWT_KEY){
        throw new ServerError("JWT_kEY not found")
    }
    if(!process.env.MONGO_URI){
        throw new ServerError("MONGO URI not found")
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log(error);
    }
    console.log("mongodb is initialized")
    app.listen(PORT,()=>{
        console.log(`ticket service has started on ${PORT}`)
    })
};
start();