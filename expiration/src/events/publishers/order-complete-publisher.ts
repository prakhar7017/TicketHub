import { ExpirationCompleteEvent, Publisher, Subjects } from "@prakhartickets/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.EXPIRATIONCOMPLETE=Subjects.EXPIRATIONCOMPLETE;
}