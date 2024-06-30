import nats from 'node-nats-streaming';
import { TicketCreatedListner } from './events/ticket-created-listner'; 

const stan= nats.connect("ticketing","abc",{url:"http://localhost:4222"})

stan.on("connect",()=>{
    console.log("Listner connected to NATS");


    stan.on("close",()=>{
        console.log("i am closed");
        process.exit(1);
    })

    new TicketCreatedListner(stan).listen();
})


