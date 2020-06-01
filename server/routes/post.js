const express = require('express');
const mongoose = require('mongoose');

const requireLogin = require('../middlewares/requireLogin');

const router = express.Router();
const Post = mongoose.model('Post');

router.get('/allpost',(req,res)=>{
    Post.find({privacy: "public"})
    .populate("postedBy", "_id name")
    .then((posts)=>{
        res.json({posts})
    })
    .catch((err)=>{
        console.log(err);
    })
});
router.post('/createpost', requireLogin, (req,res)=>{
    const {title, body, pic, privacy} = req.body;
    console.log(title, body, pic, privacy)
    if(!title || !body || !pic || !privacy){
        return res.status(422).json({
            error: "Please add all the fields."
        });
    }
    const post = new Post({
        title,
        body,
        photo: pic,
        privacy,
        postedBy: req.user
    });

    post.save().then((result)=>{
        res.json({
            post: result
        })
    }).catch((err)=>{
        console.log(err);
    });
});
router.get('/mypost', requireLogin, (req,res)=>{
    Post.find({postedBy: req.user._id})
    .populate("postedBy","_id name")
    .then((myposts)=>{
        res.json({myposts});
    })
    .catch((err)=>{
        console.log(err);
    });
});
module.exports = router;