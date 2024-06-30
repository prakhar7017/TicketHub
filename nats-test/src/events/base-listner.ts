import { Message, Stan } from "node-nats-streaming";

export abstract class Listner {
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
