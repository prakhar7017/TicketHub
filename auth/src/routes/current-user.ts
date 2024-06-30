import express,{ Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ServerError, currentUser, requireAuth } from "@prakhartickets/common";
const router=express.Router();

router.get("/api/users/currentuser",currentUser,requireAuth,(req:Request,res:Response)=>{
    try {
        return res.status(200).json({
            success:true,
            message:"current user",
            data:{currentUser:req.user},
        })
    } catch (error) {
        throw new ServerError("Server Error");
    }
});

export { router as currentUserRouter}