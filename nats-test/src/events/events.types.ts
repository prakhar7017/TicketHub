export interface Event {
    subject: Subjects;
    data:any
}

export enum Subjects {
    TICKETCREATED="ticket:created",
    ORDERCREATED="order:created"
}

export interface TicketCreatedEvent {
    subject: Subjects.TICKETCREATED;
    data:{
        id:string;
        title:string;
        price:number;
    }
}