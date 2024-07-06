import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import {ValidateRequest,requireAuth,NotFoundError,BadRequestError,ServerError, Forbidden, OrderStatus} from '@prakhartickets/common';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-listner';
import { natsWrapper } from '../nats-wrapper';

const router=express.Router();

const validation=[body('token').not().isEmpty(),body('orderId').not().isEmpty()];

router.post('/api/payments',ValidateRequest,validation,requireAuth,async (req:Request,res:Response)=>{
    const { token, orderId }= req.body;
    const userId= req.user!.id;
    const email= req.user!.email;
    try {
        const order= await Order.findById(orderId);

        if(!order){
            throw new NotFoundError("Order not found");
        }

        if(order.userId!=userId){
            throw new Forbidden('Action Forbidden');
        }

        if(order.status===OrderStatus.CANCELLED){
            throw new BadRequestError('cannot pay cancelled order');
        }

        const charge=await stripe.charges.create({
            currency:'inr',
            amount: order.price * 100 ,
            source: token,
            description: 'Charge for some product or service'
        });

        const payment=Payment.build({
            userId:userId,
            price:order.price,
            orderId:order.id,
            stripeId:charge.id,
            email:email
        })
        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.Client).publish({
            stripeId:payment.stripeId,
            orderId:payment.orderId,
            id:payment.id
        })
        return res.status(200).json({
            success:true,
            message:"Payment Initiated",
            id:payment.id
        });
    }catch(error:any){
        console.log(error);
        throw new ServerError('Internal Server Error');
    }
})