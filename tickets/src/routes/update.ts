import express,{ Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, ServerError, NotFoundError, Forbidden, requireAuth, ValidateRequest} from "@prakhartickets/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatePublisher } from "../events/ticket-update-publisher";
import { natsWrapper } from "../nats-wrapper";

const validation=[
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isInt({gt:0}).withMessage("Price must be greater than 0")
];

const router=express.Router();
router.put("/api/tickets/:id",requireAuth,validation,ValidateRequest, async (req:Request,res:Response)=>{
    const { id }=req.params;
    const { title, price }=req.body;
    if(!id){
        throw new NotFoundError("Id is required");
    }
    try {
        const ticket= await Ticket.findById(id);
        if(!ticket){
            throw new NotFoundError("Ticket not found");

        }

        if(ticket.orderId){
            throw new BadRequestError("Ticket is reserved, cannot be edited");
        }

        if(ticket.userId!==req.user!.id){
            throw new Forbidden("You are not authorized to update this ticket");
        }
        ticket.set({
            title,
            price
        });
        await ticket.save();
        await new TicketUpdatePublisher(natsWrapper.Client).publish({
            id:ticket.id,
            title:ticket.title,
            price:ticket.price,
            userId:ticket.userId,
            version:ticket.version
        })
        return res.status(200).json({
            success:true,
            message:"Ticket updated successfully",
            data:ticket
        })
    } catch (error) {
        if(error instanceof BadRequestError){
            throw new BadRequestError("Bad Request Error");
        }
        throw new ServerError("Server unable to respond")
    }
})

export { router as updateTicketRouter };