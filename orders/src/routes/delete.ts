import express ,{ Request, Response } from "express";
import  { body } from "express-validator";
import { BadRequestError, NotFoundError, requireAuth,ServerError,ValidateRequest,OrderStatus,Forbidden } from "@prakhartickets/common"; 
import { Order } from "../models/order";

const router=express.Router();

router.delete("/api/orders/:orderId",requireAuth, async (req:Request,res:Response)=>{
    const { orderId }=req.params;
    try {
        const order=await Order.findById(orderId);
        if(!order){
            throw new NotFoundError('Order Not Found');
        }
        if(order.userId!==req.user?.id){
            throw new Forbidden('Action Permission Denied');
        }
        order.status=OrderStatus.CANCELLED;
        await order.save();
        // send event 
        return res.status(204).json({
            success:true,
            message:"order updated successfully",
            order:order
        })
    } catch (error) {
        console.log(error);
        throw new ServerError('Internal Server Error');
    }
});

export { router as deleteOrderRouter };