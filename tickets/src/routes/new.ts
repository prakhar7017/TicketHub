import express ,{ Request, Response } from "express";
import  { body } from "express-validator";
import { BadRequestError, requireAuth,ServerError,ValidateRequest } from "@prakhartickets/common"; 
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "@prakhartickets/common";
import { natsWrapper } from "../nats-wrapper";

const router=express.Router();

const validation=[
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isInt({gt:0}).withMessage("Price must be greater than 0")
];

interface TicketI {
    title:string;
    price:number;
}


router.post("/api/tickets",requireAuth,validation,ValidateRequest, async (req:Request,res:Response)=>{
    const { title, price }:TicketI=req.body;
    try {
        const newTicket = Ticket.build({
            title:title,
            price:price,
            userId:req.user!.id
        })

        await newTicket.save();

        new TicketCreatedPublisher(natsWrapper.Client).publish({
            id:newTicket.id,
            title:newTicket.title,
            price:newTicket.price,
            userId:newTicket.userId
        })

        return res.status(201).json({
            success:true,
            message:"Ticket created successfully",
            data:newTicket
        })
        
    } catch (error) {
        if(error instanceof BadRequestError){
            throw new BadRequestError("Bad Request Error");
        }
        throw new ServerError("Server unable to respond")
    }
});

export { router as createTicketRouter };