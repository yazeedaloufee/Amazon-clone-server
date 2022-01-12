'use strict';
const express = require('express');
const authRouter = express.Router();

const User = require('./models/users.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const verifyUser = require('./middleware/verifyUser')
authRouter.get('/',(req,res)=>{
    res.send('welcome to server.js');
})
authRouter.get('/bad',(req,res)=>{
throw new Error('test error')
})

authRouter.post('/signup',verifyUser,async(req,res,next)=>{
    try{
        let user = new User(req.body);
        console.log(user)
        const savedUser = await user.save();

        res.status(201).json({
            user:savedUser,
            token:savedUser.token
        }
        )
    }catch(error){
        next(error.message);
    }
})

authRouter.post('/signin',basicAuth,(req,res,next)=>{
   try{
       res.status(200).json({
           user:req.user,
           token:req.user.token
       })
   }catch(error){
       next(error.message)
   }
})

authRouter.get('/user',bearerAuth,(req,res)=>{
    res.json({user:req.user})
})
module.exports= authRouter;