const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {JWT_SECRET} = require('../keys');
const requireLogin = require('../middlewares/requireLogin');

const router = express.Router();
const User = mongoose.model("User");

// Protected resource
router.get('/protected',requireLogin, (req,res)=>{
    res.send('Welcome back');
});

// Sign up routes
router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body
    if(!email || !name || !password){
        return res.status(422).json({
            error: "Please add all the fields."
        })
    }
    User.findOne({email:email})
        .then((savedUser)=>{
            if(savedUser){
                return res.status(422).json({
                    error: "User already exists with this email."
                })
            }
            // hashing the password 
            bcrypt.hash(password, 11)
            .then((hashedPasswoord)=>{
                const user = new User({
                    email,
                    password: hashedPasswoord,
                    name
                })

                user.save()
                .then((user)=>{
                    res.json({
                        message: "Successfully signed up."
                    })
                })
                .catch((e)=>{
                    console.log(e);
                    res.status(422).json({
                        error: "Unable to sign up, please try again."
                    });
                });
            })
        })
        .catch((e)=>{
            console.log(e);
            res.status(422).json({
                error: "Unable to sign up, please try again."
            });
        });
});

// Sign In routes
router.post('/signin', (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({
            error: "Please provide email or password."
        });
    }
    User.findOne({
        email: email
    })
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({
                error: "Invalid email or password."
            });  
        }
        bcrypt.compare(password, savedUser.password)
        .then((doMatch)=>{
            if(doMatch){
                // res.json({
                //     message: "Successfully signed in."
                // });
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET);
                res.json({token});
            }else{
                return res.status(422).json({
                    error: "Invalid email or password."
                });
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    })
});

module.exports = router;