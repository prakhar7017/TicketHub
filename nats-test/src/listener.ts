import nats,{Message} from 'node-nats-streaming';
import { Stan } from 'node-nats-streaming';

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

abstract class Listner {
    abstract subject:string; // name if the channel
    abstract queueGroupName:string; // name of the queue grp this listner will join
    abstract onMessage(data:any,msg:Message):void ;
    private client:Stan;
    protected ackWait=5*1000; // 5 sec no of sec this listern has wait for ack a message

    constructor(client:Stan){
        this.client=client;
    }

    subscriptionsOptions(){
        return this.client.subscriptionOptions().setDeliverAllAvailable().setAckWait(this.ackWait).setDurableName(this.queueGroupName).setManualAckMode(true);
    }

    listen(){
        const subscription=this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionsOptions()
        )

        subscription.on("message",(msg:Message)=>{
            const parsedData= this.parsePayload(msg);

            this.onMessage(parsedData,msg);
        })
    }

    parsePayload(msg:Message){
        const payload = msg.getData();
        return typeof payload === 'string' ? JSON.parse(payload): JSON.parse(payload.toString('utf-8'));
    }
}

