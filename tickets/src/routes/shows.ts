import express ,{ Request, Response } from "express";
import { BadRequestError, ServerError } from "@prakhartickets/common"; 
import { Ticket } from "../models/ticket";

const router=express.Router();

router.get("/api/tickets", async (req:Request,res:Response)=>{
    try {
        const tickets= await Ticket.find({});
        return res.status(200).json({
            success:true,
            message:"Ticket fetched successfully",
            data:tickets
        })
    } catch (error) {
        if(error instanceof BadRequestError){
            throw new BadRequestError("Bad Request Error");
        }
        throw new ServerError("Server unable to respond")
    }
});

export { router as getTicketsRouter };