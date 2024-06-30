import { Stan } from "node-nats-streaming";
import { Event } from "./events.types";


export abstract class Publisher<T extends Event> {
    abstract subject:T["subject"];
    private client:Stan;

    constructor(client:Stan){
        this.client=client;
    } 

    publish(data:T["data"]){
        this.client.publish(this.subject,JSON.stringify(data),()=>{
            console.log("data is published");
        })
    }

}