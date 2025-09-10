import { sendSigninEmail } from "../mail/index.js";
import { signupSchema } from "../type.js"
import jwt, { type JwtPayload } from "jsonwebtoken";
import express from "express";


const Signup = async(req:any, res:any) => {
    try {
            const { data, success } = signupSchema.safeParse(req.body);
            if (!success) {
                return res.status(400).json({ message: "Incorrect inputs" });
            }
    
            const token = jwt.sign(
                {email:data.email},
                process.env.Email_JWT_SECRET!,
                {expiresIn:"1h"}
            );
    
            if(process.env.NODE_ENV === "development") {
                await sendSigninEmail(data.email, token);
            } else {
                console.log(`please visit ${process.env.BACKEND_URL}/api/v1/signin/post?token=${token}`);
                
            }
    
            res.status(200).json({ message: "Check your email for login link" });
        } catch (e) {
            res.status(500).json({ message: "Something went wrong" });
        }

}

const Signin = async (req:any, res:any) => {
     try {
            const { data, success } = signupSchema.safeParse(req.body);
            if (!success) {
                return res.status(400).json({ message: "Incorrect inputs" });
            }
            const token = jwt.sign(
                {email:data.email},
                process.env.Email_JWT_SECRET!,
                {expiresIn:"1h"}
            );
    
            if(process.env.NODE_ENV === "production") {
                await sendSigninEmail(data.email, token);
            } else {
                console.log(`please visit ${process.env.BACKEND_URL}/api/v1/signin/post?token=${token}`);
                
            }
    
            res.status(200).json({ message: "Check your email for login link" });
        } catch (e) {
            res.status(500).json({ message: "Something went wrong" });
        }
}

const SigninPost = async (req:any, res:any) => {
     const token = req.query.token as string;
        try {
            const { email } = jwt.verify(token, process.env.Auth_JWT_SECRET!) as JwtPayload;
            const authToken = jwt.sign(
                {email},
                process.env.Auth_JWT_SECRET!,
                {expiresIn:"1h"}
            );
            res.cookie("authToken", authToken);
            res.status(200).json({ message: "Login successful" });
        } catch (e) {
            res.status(401).json({ message: "Invalid token" });
        }
}

export const AuthController = {
    Signup,
    Signin,
    SigninPost
}