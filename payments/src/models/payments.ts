import mongoose, {Document, model, Model, Schema } from "mongoose";
import { OrderStatus } from "@prakhartickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentAttr {
    userId:string;
    email:string;
    orderId:string;
    price:number;
    stripeId:string;
}

interface PaymentDoc extends Document {
    userId:string;
    email:string;
    orderId:string;
    price:number;
    stripeId:string
}

interface PaymentModel extends Model<PaymentDoc> {
    build(attr:PaymentAttr):PaymentDoc;
}

const paymentSchema=new Schema({
    userId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        requied:true
    },
    orderId:{
        type:String,
        requied:true
    },
    price:{
        type:Number,
        requied:true
    },
    stripeId:{
        type:String,
        required:true,
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
        }
    }
})


paymentSchema.statics.build=(attrs:PaymentAttr)=>{
    return new Payment(attrs);
}

const Payment= model<PaymentDoc,PaymentModel>('Payment',paymentSchema);

export { Payment };
