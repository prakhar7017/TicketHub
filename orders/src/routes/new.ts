import express ,{ Request, Response } from "express";
import  { body } from "express-validator";
import { BadRequestError, NotFoundError, requireAuth,ServerError,ValidateRequest,OrderStatus } from "@prakhartickets/common"; 
import mongoose from "mongoose";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router=express.Router();

const EXPIRATION_WINDOW_IN_SECONDS=10*60;

const validation=[
    body("ticketId").not().isEmpty().custom((input:string)=> mongoose.Types.ObjectId.isValid(input)).withMessage("ticketId is required"),
];



router.post("/api/orders",requireAuth,validation,ValidateRequest, async (req:Request,res:Response)=>{
    const { ticketId }= req.body;

    try {
        // find the ticket in db
        const ticket=await Ticket.findById(ticketId);
        if(!ticket){
            throw new NotFoundError('Ticket not found');
        }
        // ticket is not already reserved
        const isReserved=await ticket.isReserved();
        if(isReserved){
            throw new BadRequestError('Ticket is already reserved');
        }
        // calculate the expiration date of the order
        const expiration=new Date();
        expiration.setSeconds(expiration.getSeconds()+EXPIRATION_WINDOW_IN_SECONDS);
        // build the order and save to db
        const order=Order.build({
            userId:req.user!.id,
            status:OrderStatus.CREATED,
            expiresAt:expiration,
            ticket:ticket 
        })

        await order.save();
        // Publish an event saying order is created
        new OrderCreatedPublisher(natsWrapper.Client).publish({
            id:order.id,
            userId:order.userId,
            status:order.status,
            expiresAt:order.expiresAt.toISOString(),
            ticket:{
                id:ticket.id,
                price:ticket.price
            }
        })
        res.status(201).json({
            success:true,
            message:"order created successfully",
            order:order
        })  
    } catch (error) {
        console.log(error);
        throw new ServerError('Internal Server Error')
    }
});

export { router as newOrderRouter };