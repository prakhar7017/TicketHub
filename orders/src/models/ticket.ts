import mongoose, { model, Document, Schema, Model } from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@prakhartickets/common";


interface TicketAttr {
    title:string;
    price:number;
    // version:string 
}

export interface TicketDoc extends Document {
    title:string,
    price:number;
    isReserved():Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc>{
    build(attrs:TicketAttr):TicketDoc;
}

const ticketSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:0
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id,
            delete ret._id
        }
    }
})
// statics is used to add a method directly to the model
ticketSchema.statics.build=(attrs:TicketAttr)=>{
    return new Ticket(attrs);
}

// and methods is used to add a method to the instance of the model ie. document
ticketSchema.methods.isReserved=async function(){
    // this is refering to the ticket document we just called 'isReserved' on
    const existingOrder=await Order.findOne({
        ticket:this,
        status:{
            $in:[
                OrderStatus.CREATED,
                OrderStatus.AWAITINGPAYMENT,
                OrderStatus.COMPLETE            
            ]
        }
    })
    return !!existingOrder;
}

const Ticket=model<TicketDoc,TicketModel>("Ticket",ticketSchema);


export { Ticket }
