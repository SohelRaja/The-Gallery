const express = require('express');
const mongoose = require('mongoose');

const requireLogin = require('../middlewares/requireLogin');

const router = express.Router();
const Post = mongoose.model('Post');

router.post('/createpost', requireLogin, (req,res)=>{
    const {title, body} = req.body;
    if(!title || !body){
        return res.status(422).json({
            error: "Please add all the fields."
        });
    }
    const post = new Post({
        title,
        body,
        postedBy: req.user
    });

    post.save().then((result)=>{
        res.json({
            post: result
        })
    }).catch((err)=>{
        console.log(err);
    });
})

module.exports = router;