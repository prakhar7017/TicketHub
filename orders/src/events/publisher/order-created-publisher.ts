import { OrderCreatedEvent, Publisher, Subjects } from "@prakhartickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.ORDERCREATED=Subjects.ORDERCREATED;
}