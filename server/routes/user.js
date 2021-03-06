const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Cloudinary setup
const cloudinary = require('cloudinary').v2;

const {CLOUD_NAME_CLOUDINARY, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY} = require('./../config/keys');

cloudinary.config({
    cloud_name: CLOUD_NAME_CLOUDINARY,
    api_key: API_KEY_CLOUDINARY,
    api_secret: API_SECRET_CLOUDINARY
});

const requireLogin = require('../middlewares/requireLogin');

const router = express.Router();
const Post = mongoose.model('Post');
const User = mongoose.model('User');

router.get('/allusers',requireLogin,(req,res)=>{
    if(req.user.priority === "admin" || req.user.priority === "owner"){
        User.find()
        .select("-password") // every things except password
        .then((allusers)=>{
            res.json({allusers})
        })
        .catch((err)=>{
            console.log(err);
        })
    }else{
        return res.status(422).json({error: "You don't have access to do."});
    }
    
});

router.put('/changetoadmin',requireLogin,(req,res)=>{
    if(req.user.priority === "owner"){
        User.findByIdAndUpdate(req.body.userId,{
            priority: "admin"
        },{
            new: true
        }).exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err});
            }else{
                res.json(result);
            }
        })
    }else{
        return res.status(422).json({error: "You don't have access to do."});
    }
});

router.put('/changetouser',requireLogin,(req,res)=>{
    if(req.user.priority === "owner"){
        User.findByIdAndUpdate(req.body.userId,{
            priority: "normal"
        },{
            new: true
        }).exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err});
            }else{
                res.json(result);
            }
        })
    }else{
        return res.status(422).json({error: "You don't have access to do."});
    }
});

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

router.put('/updatepic', requireLogin, async (req,res)=>{
    const pic = req.body.pic;
    if(!pic){
        return res.status(422).json({error: "Please provide a picture!"});
    }
    try{
        const picUploadedResponse = await cloudinary.uploader.upload(pic, {
            upload_preset: "the-gallery"
        });
        const picUrl = picUploadedResponse.url;
        const imagePublicId = picUploadedResponse.public_id;
        User.findById(req.user._id)
        .exec((err,user)=>{
            if(err || !user){
                return res.status(422).json({error:err})
            }
            const picId = user.picid;
            if(picId !== "undefined"){
                cloudinary.uploader.destroy(picId, function(error,response) {
                    if(error){
                        return res.status(422).json({error: "Something went to wrong!"});
                    }
                })
            }
        });
        // console.log(picUploadedResponse)
        User.findByIdAndUpdate(req.user._id, {
            $set: {pic: picUrl,picid: imagePublicId},
        },{new: true}, 
            (err,result)=>{
            if(err){
                return res.status(422).json({error: "Unable to update profile pic!"});
            }
            res.json(result);
        })
    }catch(err){
        console.log(err)
        return res.status(422).json({
            error: "Something went wrong, try again!"
        });
    };
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
            error: "Name must be within 4 to 20 characters."
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
    .select("_id email name priority")
    .then(user=>{
        res.json({user});
    }).catch(err=>{
        console.log(err);
    })
})

module.exports = router;