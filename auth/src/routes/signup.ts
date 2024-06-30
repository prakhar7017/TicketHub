import express,{ Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { Password } from "../helpers/password";
import jwt from "jsonwebtoken";
import { ValidateRequest, BadRequestError, ServerError } from "@prakhartickets/common"

const router=express.Router();
const validation=[
    body('email')
        .isEmail()
        .withMessage("Enter a valid email address"),
    body('password')
        .trim()
        .isLength({ min:4 , max:20 })
        .withMessage('Password must be between 4 to 20 characters')
]

router.post("/api/users/signup", validation, ValidateRequest, async (req:Request,res:Response)=>{
    try {
        const {email,password}=req.body;
        console.log(email,password);

        const userExist=await User.findOne({ email });
        if(userExist){
            throw new BadRequestError("Email already in use");
        }

        const hashPassword:string= await Password.toHash(password);

        const newUser = User.build({
            email:email,
            password:hashPassword,
        })

        newUser.save();

        return res.status(201).json({
            success:true,
            message:"user created successfully",
            data:{
                email:newUser.email
            }
        })
    } catch (error) {
        if(error instanceof BadRequestError){
            throw new BadRequestError("Email already in use");
        }
        throw new ServerError("Server unable to respond")
    }
});

export { router as signupRouter}