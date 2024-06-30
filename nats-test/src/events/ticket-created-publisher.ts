import { Publisher } from "./base-publisher";
import { Subjects, TicketCreatedEvent } from "./events.types";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TICKETCREATED=Subjects.TICKETCREATED;
    

}