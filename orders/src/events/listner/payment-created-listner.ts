import { Message } from "node-nats-streaming";
import { Listner, NotFoundError, OrderStatus, PaymentCreatedEvent, Subjects , } from "@prakhartickets/common";
import { Ticket } from "../../models/ticket";
import { QueueGroupName } from "./listner.types";
import { Order } from "../../models/order";

export class PaymentCreatedListner extends Listner<PaymentCreatedEvent> {
    subject: Subjects.PAYMENTCREATED=Subjects.PAYMENTCREATED;
    queueGroupName: string=QueueGroupName.ORDERS_SERVICE;
    async onMessage(data:PaymentCreatedEvent['data'],msg: Message): Promise<void> {
        const { orderId }= data;
    
        const order=await Order.findById(orderId);

        if(!order){
            throw new NotFoundError('Order not found');
        }

        order.set({
            status:OrderStatus.COMPLETE
        })
        await order.save();

        msg.ack();
    }
}   