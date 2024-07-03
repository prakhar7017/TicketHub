import mongoose, { model, Document, Schema, Model } from "mongoose";


interface TicketAttr {
    title:string;
    price:number;
    // version:string 
}

export interface TicketDoc extends Document {
    title:string,
    price:number;
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

ticketSchema.statics.build=(attrs:TicketAttr)=>{
    return new Ticket(attrs);
}

const Ticket=model<TicketDoc,TicketModel>("Ticket",ticketSchema);


export { Ticket }
