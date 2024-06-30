import nats,{Message} from 'node-nats-streaming';

const stan= nats.connect("ticketing","abc",{url:"http://localhost:4222"})

stan.on("connect",()=>{
    console.log("Listner connected to NATS");


    stan.on("close",()=>{
        console.log("i am closed");
    })

    const options= stan.subscriptionOptions().setManualAckMode(true);


    const subscription=stan.subscribe("ticket:created",'order-service-group',options);

    subscription.on("message",(msg:Message)=>{
        const data=msg.getData();

        if(typeof data==="string"){
            console.log(`Received event #${msg.getSequence()} with data: ${data}`);
        }

        msg.ack();
    }) 
})
