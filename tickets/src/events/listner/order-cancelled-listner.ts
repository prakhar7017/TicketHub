import { Listner,Subjects, BadRequestError, NotFoundError, OrderCancelledEvent } from "@prakhartickets/common";
import { QueueGroupName } from "./listner.types";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatePublisher } from "../ticket-update-publisher";

export class OrderCancelledListner extends Listner<OrderCancelledEvent>{
    subject:Subjects.ORDERCANCELLED=Subjects.ORDERCANCELLED;
    queueGroupName=QueueGroupName.TICKET_SERVICE
    async onMessage(data:OrderCancelledEvent['data'],msg:Message){
        const {  ticket }=data;
        const _ticket=await Ticket.findOne({
            _id:ticket.id,
        })

        if(!_ticket){
            throw new NotFoundError("Ticket not found");
        }

        _ticket.set({
            orderId:undefined
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