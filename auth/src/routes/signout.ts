import express from "express";

const router=express.Router();

router.post("/api/users/signout",(req,res)=>{
    try {
        req.session=null;
        return res.status(200).json({
            success:true,
            message:"logged out successfully",
            data:{}
        })
    } catch (error) {
        
    }
});

export { router as signoutRouter}