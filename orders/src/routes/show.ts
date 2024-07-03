import express ,{ Request, Response } from "express";
import  { body } from "express-validator";
import { BadRequestError, NotFoundError, requireAuth,ServerError,ValidateRequest,OrderStatus } from "@prakhartickets/common"; 
import { Order } from "../models/order";

const router=express.Router();

router.get("/api/orders/:orderId",requireAuth, async (req:Request,res:Response)=>{
    const { orderId }=req.params;
    try {
        const order=await Order.findById(orderId).populate('ticket');
        return res.status(200).json({
            success:true,
            message:"order fetched successfully",
            order:order
        })
    } catch (error) {
        console.log(error);
        throw new ServerError('Internal Server Error');
    }
});

export { router as showOrderRouter };