import mongoose, { Document, Model, Schema, model } from "mongoose";

// an interface that describe attributes of user
interface UserAttr {
  email: string;
  password: string;
}

// an interface that describe the properties a user model has
interface UserModel extends Model<UserDoc> {
  build(attr: UserAttr): UserDoc;
}

// interface that describe the properties a user doc has
interface UserDoc extends Document {
  email: string;
  password: string;
  updatedAt: string;
  createdAt: string;
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;

        }
    }
});

UserSchema.statics.build = (attr: UserAttr) => {
  return new User(attr);
};

const User = model<UserDoc, UserModel>("User", UserSchema);

export { User };
