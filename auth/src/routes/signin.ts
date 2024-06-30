import express,{ Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { Password } from "../helpers/password";
import jwt from "jsonwebtoken";
import { ValidateRequest, NotFoundError, BadRequestError, ServerError } from "@prakhartickets/common"
const router=express.Router();

const validate=[
    body('email')
    .isEmail()
    .withMessage("Enter a valid email adderss"),
    body("password")
    .trim()
    .notEmpty()
    .withMessage("Enter a valid password")
]

router.post("/api/users/signin", validate, ValidateRequest, async (req:Request,res:Response)=>{
    try {
        const {email,password}=req.body;

        const userExist= await User.findOne({ email });
        if(!userExist){
            throw new NotFoundError("User does not exist")
        }
        console.log(userExist);
        const isMatched= await Password.compare(userExist.password,password);
        if(!isMatched){
            throw new BadRequestError("email or password is incorrect");
        }

        const userToken= jwt.sign({
            id:userExist.id,
            email:userExist.email
        },process.env.JWT_KEY!);

        req.session={
            jwt:userToken 
        }

        return res.status(200).json({
            success:true,
            message:"logged in successfully",
        })
    } catch (error) {
        console.log(error);
        throw new ServerError("Server Error");
    }
});

export { router as signinRouter}