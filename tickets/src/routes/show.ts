import express ,{ Request, Response } from "express";
import { BadRequestError, ServerError, NotFoundError } from "@prakhartickets/common"; 
import { Ticket } from "../models/ticket";

const router=express.Router();

router.get("/api/tickets/:id", async (req:Request,res:Response)=>{
    const { id }=req.params;
    if(!id){
        throw new NotFoundError("Id is required");
    }
    try {

        const ticket= await Ticket.findById(id);

        if(!ticket){
            throw new NotFoundError("Ticket not found");
        }
        return res.status(200).json({
            success:true,
            message:"Ticket fetched successfully",
            data:ticket
        })
    } catch (error) {
        if(error instanceof BadRequestError){
            throw new BadRequestError("Bad Request Error");
        }
        throw new ServerError("Server unable to respond")
    }
});

export { router as getTicketRouter };