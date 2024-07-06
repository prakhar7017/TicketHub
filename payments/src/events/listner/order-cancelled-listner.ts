import { Listner,Subjects, BadRequestError, NotFoundError, OrderCancelledEvent, OrderStatus } from "@prakhartickets/common";
import { QueueGroupName } from "./listner.types";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListner extends Listner<OrderCancelledEvent>{
    subject:Subjects.ORDERCANCELLED=Subjects.ORDERCANCELLED;
    queueGroupName=QueueGroupName.PAYMENT_SERVICE
    async onMessage(data:OrderCancelledEvent['data'],msg:Message){
        const { id, version, ticket }= data;

        const order= await Order.findById({
            _id:id,
            version:version-1
        });
        

        if(!order){
            throw new NotFoundError("order not found");
        }

        order.set({
            status:OrderStatus.CANCELLED
        })

        await order.save();
        msg.ack();
    }
}