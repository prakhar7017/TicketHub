import express from "express";
import 'express-async-errors';
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";
import { getTicketRouter } from "./routes/show";
import { getTicketsRouter } from "./routes/shows";
import { updateTicketRouter } from "./routes/update";
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

app.use(createTicketRouter);
app.use(getTicketRouter);
app.use(getTicketsRouter);
app.use(updateTicketRouter);

app.all('*',async (req,res)=>{
    throw new NotFoundError("Some error has occured");
})

app.use(errorHandler);

export { app }