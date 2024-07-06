import { ServerError } from "@prakhartickets/common";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreateListner } from "./events/listners/order-created-listner";
const start=async ()=>{
    if(!process.env.NATS_CLIENT_ID){
        throw new ServerError("NATS_CLIENT_ID not found")
    }
    if(!process.env.NATS_URL){
        throw new ServerError("NATS_URL not found")
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new ServerError("NATS_CLUSTER_ID not found")
    }
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL);
        natsWrapper.Client.on("close",()=>{
            console.log("NATS connection closed");
            process.exit();
        })
        process.on("SIGINT",()=>natsWrapper.Client.close());
        process.on("SIGTERM",()=>natsWrapper.Client.close());

        new OrderCreateListner(natsWrapper.Client).listen();

    } catch (error) {
        console.log(error);
    }
};
start();