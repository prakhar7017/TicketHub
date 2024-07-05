import mongoose from "mongoose";
import { app } from "./app";
const PORT=process.env.PORT || 3000;
import { ServerError } from "@prakhartickets/common";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListner } from "./events/listner/ticket-created-listner";
import { TicketUpdateListner } from "./events/listner/ticket-update-listner";
import { logger } from "@prakhartickets/common";

const start=async ()=>{
    if(!process.env.JWT_KEY){
        throw new ServerError("JWT_kEY not found")
    }
    if(!process.env.MONGO_URI){
        throw new ServerError("MONGO URI not found")
    }
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

        new TicketCreatedListner(natsWrapper.Client).listen();
        new TicketUpdateListner(natsWrapper.Client).listen();
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log(error);
    }
    console.log("mongodb is initialized")
    app.listen(PORT,()=>{
        console.log(`orders service has started on ${PORT}`)
        logger.logInfo("Order Service initialized")
    })
};
start();