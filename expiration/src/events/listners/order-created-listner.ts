import { Listner, OrderCreatedEvent, Subjects } from "@prakhartickets/common";
import { QueueGroupName } from './listner.types'
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreateListner extends Listner<OrderCreatedEvent>{
    subject: Subjects.ORDERCREATED=Subjects.ORDERCREATED;
    queueGroupName:string=QueueGroupName.EXPIRATION_SERVICE;
    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        const { id, expiresAt }=data;
        const delay= new Date(expiresAt).getTime()- new Date().getTime();

        await expirationQueue.add({
            orderId:id
        }, {
            delay: delay
        })
        msg.ack();
    }
}