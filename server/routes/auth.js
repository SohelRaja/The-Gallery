const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const User = mongoose.model("User");

router.get('/',(req,res)=>{
    res.send("hello")
});
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
            const user = new User({
                email,
                password,
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
        .catch((e)=>{
            console.log(e);
            res.status(422).json({
                error: "Unable to sign up, please try again."
            });
        });
});

module.exports = router;