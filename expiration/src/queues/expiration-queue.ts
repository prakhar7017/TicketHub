import Queue from "bull";
import { ExpirationCompletedPublisher } from "../events/publishers/order-complete-publisher";
import { natsWrapper } from "../nats-wrapper";
interface QueuePayload {
    orderId: string;
}

const expirationQueue= new Queue<QueuePayload>('order:expiration',{
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job)=>{
    const { data } =job;
    new ExpirationCompletedPublisher(natsWrapper.Client).publish({
        orderId:data.orderId
    })
    console.log("publish expiration:complete")
})

export { expirationQueue };