const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const router = express.Router();
const User = mongoose.model("User");

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

module.exports = router;