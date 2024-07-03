import express ,{ Request, Response } from "express";
import  { body } from "express-validator";
import { BadRequestError, NotFoundError, requireAuth,ServerError,ValidateRequest,OrderStatus } from "@prakhartickets/common"; 
import mongoose from "mongoose";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router=express.Router();

const validation=[
    body("ticketId").not().isEmpty().custom((input:string)=> mongoose.Types.ObjectId.isValid(input)).withMessage("ticketId is required"),
];



router.post("/api/orders",requireAuth,validation,ValidateRequest, async (req:Request,res:Response)=>{
    const { ticketId }= req.body;

    // find the ticket in db
    const ticket=await Ticket.findById(ticketId);
    if(!ticket){
        throw new NotFoundError('Ticket not found');
    }
    // ticket is not already reserved
    const order=await Order.findOne({
        ticket:ticketId,
        status:{
            $in:[OrderStatus]
        }
    })
    // calculate the expiration date of the order
    // build the order and save to db
    // Publish an event saying order is created
});

export { router as newOrderRouter };