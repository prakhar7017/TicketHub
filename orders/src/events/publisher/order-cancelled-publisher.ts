import { OrderCancelledEvent, Publisher, Subjects } from "@prakhartickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.ORDERCANCELLED=Subjects.ORDERCANCELLED;
}