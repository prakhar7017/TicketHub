import { Publisher,Subjects,PaymentCreatedEvent } from "@prakhartickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PAYMENTCREATED=Subjects.PAYMENTCREATED;
}  