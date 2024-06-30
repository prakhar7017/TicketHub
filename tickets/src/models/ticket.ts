import mongoose, {Document, Model, Schema, model} from "mongoose";

// an interface that describe attributes of ticket
interface TicketAttr {
    title: string;
    price: number;
    userId: string;
};

// an interface that describe the properties a ticket doc has
interface TicketDoc extends Document {
    title: string;
    price: number;
    userId: string;
    updatedAt: string;
    createdAt: string;
};

interface TicketModel extends Model<TicketDoc> {
    build(attr: TicketAttr): TicketDoc;
};

const TicketSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

TicketSchema.statics.build = (attr: TicketAttr) => {
    return new Ticket(attr);
};

const Ticket= model<TicketDoc,TicketModel>("Ticket",TicketSchema);

export { Ticket };



