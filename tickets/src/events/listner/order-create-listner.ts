import { Listner,Subjects,OrderCreatedEvent, BadRequestError, NotFoundError } from "@prakhartickets/common";
import { QueueGroupName } from "./listner.types";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatePublisher } from "../ticket-update-publisher";

export class OrderCreateListner extends Listner<OrderCreatedEvent>{
    subject:Subjects.ORDERCREATED=Subjects.ORDERCREATED;
    queueGroupName=QueueGroupName.TICKET_SERVICE
    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        const { id, ticket }=data;
        // find the ticket order is reserving
        const _ticket=await Ticket.findOne({
            _id:ticket.id,
        })

        if(!_ticket){
            throw new NotFoundError("Ticket not found");
        }
        // mark it reserved by added order id to it

        _ticket.set({
            orderId:id
        })

        await _ticket.save();
        
        await new TicketUpdatePublisher(this.client).publish({
            id:_ticket.id,
            title:_ticket.title,
            version:_ticket.version,
            price:_ticket.price,
            userId:_ticket.userId,
            orderId:_ticket.orderId
        });
        

        msg.ack();
    }
}