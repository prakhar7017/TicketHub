import express from "express";
import 'express-async-errors';
import mongoose from "mongoose";
import cookieSession from "cookie-session";

const app=express();
const PORT=3000;

app.set('trust proxy',true);
app.use(express.json());
app.use(cookieSession({
    keys: ['prakhar'],
    signed:true,
    secure:true,
}))

import { currentUserRouter } from "./routes/current-user";
import { signoutRouter } from "./routes/signout";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError, ServerError } from "@prakhartickets/common"

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*',async (req,res)=>{
    throw new NotFoundError("Some error has occured");
})

app.use(errorHandler);

export { app }