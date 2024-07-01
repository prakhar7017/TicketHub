import { Subjects, TicketUpdateEvent, Publisher } from "@prakhartickets/common";

export class TicketUpdatePublisher extends Publisher<TicketUpdateEvent> {
    subject: Subjects.TICKETUPDATED=Subjects.TICKETUPDATED;
}