import mongoose, { model, Document, Schema, Model } from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@prakhartickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface TicketAttr {
    id:string;
    title:string;
    price:number;
}

export interface TicketDoc extends Document {
    title:string,
    price:number;
    version:number;
    isReserved():Promise<boolean>;

}

interface TicketModel extends Model<TicketDoc>{
    build(attrs:TicketAttr):TicketDoc;
    findPreviousVersionByEvent(event:{id:string,version:number}): Promise<TicketDoc | null>;
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
ticketSchema.set("versionKey","version");
ticketSchema.plugin(updateIfCurrentPlugin);
// ticketSchema.pre("save",function(done){
//     this.$where={
//         version:this.get('version')-1
//     }
//     done();
// })

// statics is used to add a method directly to the model
ticketSchema.statics.build=(attrs:TicketAttr)=>{
    return new Ticket({
        _id:attrs.id,
        price:attrs.price,
        title:attrs.title,
    });
}

ticketSchema.statics.findPreviousVersionByEvent=(event:{id:string,version:number})=>{
    return Ticket.findOne({
        _id:event.id,
        version:event.version-1
    });
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
