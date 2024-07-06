import { Listner,Subjects,OrderCreatedEvent, BadRequestError, NotFoundError } from "@prakhartickets/common";
import { QueueGroupName } from "./listner.types";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreateListner extends Listner<OrderCreatedEvent>{
    subject:Subjects.ORDERCREATED=Subjects.ORDERCREATED;
    queueGroupName=QueueGroupName.PAYMENT_SERVICE
    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        const { id, userId, status , version, ticket }= data;

        const order=Order.build({
            id:id,
            userId:userId,
            version:version,
            price:ticket.price,
            status:status,
        })

        await order.save();
        
        msg.ack();
    }
}