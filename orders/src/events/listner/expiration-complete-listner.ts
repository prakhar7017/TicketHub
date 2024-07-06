import { Message } from "node-nats-streaming";
import { Listner, Subjects , ExpirationCompleteEvent, NotFoundError, OrderStatus } from "@prakhartickets/common";
import { QueueGroupName } from "./listner.types";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";

export class TicketCreatedListner extends Listner<ExpirationCompleteEvent> {
    subject: Subjects.EXPIRATIONCOMPLETE=Subjects.EXPIRATIONCOMPLETE;
    queueGroupName: string=QueueGroupName.ORDERS_SERVICE;
    async onMessage(data:ExpirationCompleteEvent['data'],msg: Message): Promise<void> {
        const { orderId }= data;

        const order= await Order.findById(orderId).populate('ticket');
        if(!order){
            throw new NotFoundError("order not found");
        }

        if(order.status===OrderStatus.COMPLETE){
            return msg.ack();
        }

        order.set({
            status:OrderStatus.CANCELLED
        })

        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id:order.id,
            version:order.version,
            ticket:{
                id:order.ticket.id,
                price:order.ticket.price
            }
        })

        msg.ack();
    }
}   