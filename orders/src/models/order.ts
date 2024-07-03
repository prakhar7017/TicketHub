import mongoose, { Document, Model, Schema, model } from "mongoose";
import { OrderStatus } from "@prakhartickets/common"
import { TicketDoc } from "./ticket";


interface OrderAttr {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}
interface OrderDoc extends Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  createdAt: Date;
  updatedAt: Date;
}
interface OrderModel extends Model<OrderDoc> {
  build(attr: OrderAttr): OrderDoc;
}

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum:Object.values(OrderStatus),
      default:OrderStatus.CREATED
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    }, 
  }
);

orderSchema.statics.build= (attrs:OrderAttr)=>{
    return new Order(attrs);
}



const Order=model<OrderDoc,OrderModel>('Order',orderSchema);

export  { Order };
