import express from "express";
import 'express-async-errors';
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, ServerError,currentUser } from "@prakhartickets/common"
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { showsOrderRouter } from "./routes/shows";
import { deleteOrderRouter } from "./routes/delete";
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

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(showsOrderRouter);
app.use(deleteOrderRouter);

app.all('*',async (req,res)=>{
    throw new NotFoundError("Some error has occured");
})

app.use(errorHandler);

export { app }