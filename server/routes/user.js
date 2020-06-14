const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const requireLogin = require('../middlewares/requireLogin');

const router = express.Router();
const Post = mongoose.model('Post');
const User = mongoose.model('User');

router.get('/user/:userId',requireLogin,(req,res)=>{
    User.findOne({_id: req.params.userId})
    .select("-password") // every things except password
    .then(user=>{
        Post.find({postedBy: req.params.userId, privacy: "public"})
        .populate("postedBy", "_id name")
        .exec((err, posts)=>{
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error: "User not found."});
    })
});

router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push: {followers: req.user._id}
    },{new:true},(err,data)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $push: {following: req.body.followId}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull: {followers: req.user._id}
    },{new:true},(err,data)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull: {following: req.body.unfollowId}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/updatepic', requireLogin, (req,res)=>{
    User.findByIdAndUpdate(req.user._id, {$set: {pic: req.body.pic}},{new: true}, 
        (err,result)=>{
        if(err){
            return res.status(422).json({error: "Unable to update profile pic!"});
        }
        res.json(result);
    })
});

router.put('/updatename', requireLogin, (req,res)=>{
    let name = req.body.name;
    if(!name){
        return res.status(422).json({
            error: "Please provide a new name."
        })
    }
    if(name.length > 20 || name.length < 4){
        return res.status(422).json({
            error: "Name must be within 4 to 20 charecters."
        });
    }
    User.findByIdAndUpdate(req.user._id, {$set: {name: name}},{new: true}, 
        (err,result)=>{
        if(err){
            return res.status(422).json({error: "Unable to update profile name!"});
        }
        res.json(result);
    })
});
router.put('/changepassword', requireLogin, (req,res)=>{
    const password = req.body.password;
    const prevPassword = req.body.prev;
    User.findById(req.user._id)
    .then((savedUser)=>{
        bcrypt.compare(prevPassword, savedUser.password)
        .then((doMatch)=>{
            if(doMatch){
                bcrypt.hash(password, 11)
                .then((hashedPassword)=>{
                    User.findByIdAndUpdate(req.user._id, {$set: {password: hashedPassword}},{new: true}, 
                        (err,result)=>{
                        if(err){
                            return res.status(422).json({error: "Unable to update password!"});
                        }
                        res.json({
                            message: "Password changed!"
                        })
                    })
                })
            }else{
                return res.status(422).json({
                    error: "Unable to update password!"
                });
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    })
});

router.post('/search-users',requireLogin, (req,res)=>{
    if(!req.body.query){
        return res.json({});
    }
    let userPattern = new RegExp("^"+req.body.query);
    User.find({email: {$regex: userPattern}})
    .select("_id email name")
    .then(user=>{
        res.json({user});
    }).catch(err=>{
        console.log(err);
    })
})

module.exports = router;