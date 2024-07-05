import express ,{ Request, Response } from "express";
import  { body } from "express-validator";
import { BadRequestError, NotFoundError, requireAuth,ServerError,ValidateRequest,OrderStatus } from "@prakhartickets/common"; 
import { Order } from "../models/order";

const router=express.Router();

router.get("/api/orders",requireAuth, async (req:Request,res:Response)=>{
    try {
        if(req?.user?.id==undefined){
            throw new BadRequestError("User not found");
        }
        const orders=await Order.find({
            userId:req.user!.id
        }).populate('ticket').exec();
        return res.status(200).json({
            success:true,
            message:"orders fetched successfully",
            length:orders.length,
            orders:orders
        })
    } catch (error) {
        console.log(error);
        throw new ServerError('Internal Server Error');
    }
});

export { router as showsOrderRouter };