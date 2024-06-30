import { Message } from "node-nats-streaming";
import { Listner } from "./base-listner";
import { TicketCreatedEvent,Subjects} from "./events.types";

export class TicketCreatedListner extends Listner<TicketCreatedEvent> {
    subject: Subjects.TICKETCREATED=  Subjects.TICKETCREATED;
    queueGroupName: string= "payments-service";
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log("evnet data is received",data.id);
        msg.ack();
    }
}