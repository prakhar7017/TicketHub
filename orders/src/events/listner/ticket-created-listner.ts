import { Message } from "node-nats-streaming";
import { Listner, Subjects , TicketCreatedEvent } from "@prakhartickets/common";
import { Ticket } from "../../models/ticket";
import { QueueGroupName } from "./listner.types";

export class TicketCreatedListner extends Listner<TicketCreatedEvent> {
    subject: Subjects.TICKETCREATED=Subjects.TICKETCREATED;
    queueGroupName: string=QueueGroupName.ORDERS_SERVICE;
    async onMessage(data:TicketCreatedEvent['data'],msg: Message): Promise<void> {
        const { id, title, price, version }= data;
        
        const ticket=Ticket.build({
            id: id,
            title:title,
            price:price,
        })

        await ticket.save();

        msg.ack();
    }
}   