import { Message } from "node-nats-streaming";
import { Listner } from "./base-listner";

export class TicketCreatedListner extends Listner {
    subject: string="ticket:created";
    queueGroupName: string= "payments-service";
    onMessage(data: any, msg: Message): void {
        console.log("evnet data is received",data);
        msg.ack();
    }
}