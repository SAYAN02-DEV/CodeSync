import express from 'express';
import type { Request, Response } from 'express';
const router = express.Router();
const jwt = require("jsonwebtoken");
const userAuth = require('../middleware/userAuth');
const { UserModel } = require('../db/db');
const JWT_SECRET = "thisismyproject";

// User Registration
router.post('/register', async(req: Request, res: Response) => {
    const{email, name, password} = req.body;
    try{
        const user = await UserModel.findOne({email});
        if(user){
            res.status(400).json({message: "User already exists"});
        }else{
            await UserModel.createOne({
                email,
                name,
                password
            }).then((user: any) => {
                res.status(201).json({message: "User registered successfully", user});
            })
        }
    }catch(err){
        res.status(500).json({message: "Server Error"});
    }

});

// User Login
router.post('/login', async(req: Request, res: Response) => {
    const{email, password} = req.body;
    try{
        const user = await UserModel.findOne({email, password});
        if(user){
            const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: '1d'});
            res.status(200).json({message: "Login successful", token, user});
        }else{
            res.status(400).json({message: "Invalid Credentials"});
        }
    }catch(err){
        res.status(500).json({message: "Server Error"});
    }
})