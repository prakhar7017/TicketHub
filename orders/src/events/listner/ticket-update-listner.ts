import { Message } from "node-nats-streaming";
import { Listner, NotFoundError, Subjects , TicketUpdateEvent } from "@prakhartickets/common";
import { Ticket } from "../../models/ticket";
import { QueueGroupName } from "./listner.types";

export class TicketUpdateListner extends Listner<TicketUpdateEvent> {
    subject: Subjects.TICKETUPDATED=Subjects.TICKETUPDATED;
    queueGroupName: string=QueueGroupName.ORDERS_SERVICE;
    async onMessage(data:TicketUpdateEvent['data'],msg: Message): Promise<void> {
        const { id, title, price, version }= data;
        
        const ticket=await Ticket.findPreviousVersionByEvent(data);
        
        if(!ticket){
            throw new NotFoundError("Ticket not found");
        }

        ticket.set({
            title:title,
            price:price,
        })

        await ticket.save();

        msg.ack();
    }
}