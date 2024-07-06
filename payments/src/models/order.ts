import mongoose, {Document, model, Model, Schema } from "mongoose";
import { OrderStatus } from "@prakhartickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttr {
    id:string;
    version:number;
    userId:string;
    status:OrderStatus;
    price:number;
}

interface OrderDoc extends Document {
    userId:string;
    status:string;
    price:number;
    version:number;
}

interface OrderModel extends Model<OrderDoc> {
    build(attr:OrderAttr):OrderDoc;
}

const orderSchema=new Schema({
    userId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:Object.values(OrderStatus),
        required:true
    },
    price:{
        type:Number,
        required:true
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
        }
    }
})

orderSchema.set('versionKey','version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build=(attrs:OrderAttr)=>{
    return new Order({
        _id:attrs.id,
        price:attrs.price,
        status:attrs.status,
        userId:attrs.userId,
        version:attrs.version
    });
}

const Order= model<OrderDoc,OrderModel>('Order',orderSchema);

export { Order };
