import express from "express";
import 'express-async-errors';
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, ServerError,currentUser } from "@prakhartickets/common"

const app=express();
const PORT=3000;

app.set('trust proxy',true);
app.use(express.json());
app.use(cookieSession({
    keys: ['prakhar'],
    signed:true,
    secure:true,
}))

app.use(currentUser);


app.all('*',async (req,res)=>{
    throw new NotFoundError("Some error has occured");
})

app.use(errorHandler);

export { app }